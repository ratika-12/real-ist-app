import { nanoid } from "nanoid";
import * as config from "../config.js";
import slugify from "slugify";
import Ad from "../models/ad.js";
import User from "../models/user.js";
import { emailTemplate } from "../helpers/email.js";

export const uploadImage = async (req, res) => {
  try {
    console.log(req.body);
    const { image } = req.body;
    if (!image) return res.status(400).send("No image");

    // prepare the image
    const base64Data = new Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      
    const type = image.split(";")[0].split("/")[1];

    // image params
    const params = {
      Bucket: "realist-udemy-bucker",
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    // upload to s3
    config.AWSS3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        console.log(data);
        res.send(data);
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "Upload failed. Try again." });
  }
};
// Remove image 
export const removeImage = async (req, res) => {
    try {
      const { Key, Bucket } = req.body;
  
      // upload to s3
      config.AWSS3.deleteObject({ Bucket, Key }, (err, data) => {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        } else {
          // console.log(data);
          res.send({ ok: true });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
export const create = async (req,res)=>{
    try{
        const {photos , description , address, title , price, type,landsize}=req.body;
        
        if (photos?.length === 0){
            return res.json({error:"photos are required"})
        }
        if (price <= 0){
            return res.json({error:"Price is  required"})
        }

        if (type === null){   //type=> house,land  action=> sell or rent 
            return res.json({error:"Is property house or land?"})
        }
        console.log("----------->", req.body)
         const ad= await new Ad({
            ...req.body,
            slug: slugify(`${type}-${price}-${nanoid(6)}`),
            postedBy: req.user._id,
         }).save();
         //make user role to seller when they post their property 
         const user = await User.findByIdAndUpdate(
            req.user._id,{
                $addtoSet:{role :"Seller"} // addtoSet will not duplicate the value of role 
            },
            {
                new:true // will save the updated ad 
            }
         )
         user.password=undefined;
         user.resetCode=undefined;
         res.json({
            ad,
            user,
         })


    }catch(err){
        res.json({error:"something went wrong in uploading Ads"})
        console.log(err)
    }
}

export const ads = async (req, res) => {
    try {
      const adsForSell = await Ad.find({ action: "Sell", published: true })
        .select(
          "-photos.Key -photos.key -photos.ETag -photos.Bucket"// deselect what we dont need to show
        )
        .populate("postedBy", "name username email phone company")
        .sort({ createdAt: -1 })//sort recent 
        .limit(12);
  
      const adsForRent = await Ad.find({ action: "Rent", published: true })
        .select(
          "-photos.Key -photos.key -photos.ETag -photos.Bucket "
        )
        .populate("postedBy", "name username email phone company")
        .sort({ createdAt: -1 })
        .limit(12);
  
      res.json({ adsForSell, adsForRent });
    } catch (err) {
      console.log(err);
    }
  };
  export const read = async (req, res) => {
    try {
      const { slug } = req.params;
  
      const ad = await Ad.findOne({ slug })
        // .select("-photos.Key -photos.key -photos.ETag -photos.Bucket")
        .populate("postedBy", "name username email phone company photo.Location");
        // related
      const related = await Ad.find({
        _id: { $ne: ad._id }, //$ne is not equal
        action: ad?.action,
        type: ad?.type,
      })
        .limit(3)
        .select("-photos.Key -photos.key -photos.ETag -photos.Bucket")
        .populate("postedBy", "name username email phone company");
  
      console.log("AD => ", ad);
  
      res.json({ ad, related });
    } catch (err) {
      console.log(err);
    }
  };

  export const addToWishlist = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet: { wishlist: req.body.adId },
        },
        { new: true }
      );
      const { password, resetCode, ...rest } = user._doc;
      res.json(rest);
    } catch (err) {
      console.log(err);
    }
  };
  export const removeFromWishlist = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { wishlist: req.params.adId },
        },
        { new: true }
      );
      const { password, resetCode, ...rest } = user._doc;
      res.json(rest);
    } catch (err) {
      console.log(err);
    }
  };    
  export const contactSeller = async (req, res) => {
    try {
      const { name, email, message, phone, adId } = req.body;
  
      const user = await User.findOneAndUpdate(
        { email },
        {
          $addToSet: { enquiredProperties: adId },
        }
      );
  
      const ad = await Ad.findById(adId).populate("postedBy", "email");
  
      if (!user) {
        res.json({ error: "Could not find user with that email" });
        console.log(req.body)
        console.log("xcgxgcgxgcxcgxzc",user);
        console.log(ad);
      } else {
        // send email
        config.AWSSES.sendEmail(
          emailTemplate(
            user.email,
            `
          <p>You have received a new customer enquiry.</p>
          
          <h4>Customer details</h4>
          <p>Name: ${name}</p>
          <p>Email ${email}</p>
          <p>Phone: ${phone}</p>
          <p>Message: ${message}</p>
          <p>Enquiried property:</p>
          <a href="${config.APP_NAME}/ad/${ad.slug}">${ad?.type} in ${ad?.address} for ${ad?.action} $${ad?.price}</a>
      `,
            email,
            "New enquiry received"
          ),
          (err, data) => {
            if (err) {
              return res.json({ error: "Provide a valid email address" });
            } else {
              return res.json({ success: "Check email to access your account" });
            }
          }
        );
      }
    } catch (err) {
      console.log(err);
      res.json({ error: "Something went wrong. Try again." });
    }
  };
  export const userAds = async (req, res) => {
    try {
      const perPage = 2; // change as required
      const page = req.params.page ? req.params.page : 1;
  
      const total = await Ad.find({
        postedBy: req.user._id,
      });
  
      const ads = await Ad.find({ postedBy: req.user._id })
        .select(
          "-photos.Key -photos.key -photos.ETag -photos.Bucket "
        )
        .populate("postedBy", "name username email phone company")
        .skip((page - 1) * perPage)
        .sort({ createdAt: -1 })
        .limit(perPage);
      res.json({ ads, total: total?.length });
    } catch (err) {
      console.log(err);
    }
  };
  
  
  export const update = async (req, res) => {
    try {
      const { photos, price, type, address, description } = req.body;
  
      let ad = await Ad.findById(req.params._id);
      const owner = req.user._id == ad?.postedBy;
      if (!owner) {
        return res.json({ error: "Permission denied" });
      } else {
        //validation
        if (!photos?.length) {
          return res.json({ error: "Photos are required" });
        }
        if (!price) {
          return res.json({ error: "Price is required" });
        }
        if (!type) {
          return res.json({ error: "Is property house or land?" });
        }
        if (!address) {
          return res.json({ error: "Address is required" });
        }
        if (!description) {
          return res.json({ error: "Description is required" });
        }
  
        
        await update({
          ...req.body,
          slug: ad.slug,
        });
        res.json({ ok: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  export const remove=async (req,res)=>{
    try{
      let ad = await Ad.findById(req.params._id);
      const owner = req.user._id == ad?.postedBy;
    if(!owner){
      return res.json({error: "Permission Denied"})

    }else{
      await Ad.findByIdAndRemove(ad._id)
      res.json({ok:true})
    }
    }catch(err){
      console.log(err)
    }
  }
  export const enquiredProperties = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const ads = await Ad.find({ _id: user.enquiredProperties }).sort({
        createdAt: -1,
      });
      res.json(ads);
    } catch (err) {
      console.log(err);
    }
  };
  
  export const wishlist = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const ads = await Ad.find({ _id: user.wishlist }).sort({ createdAt: -1 });//most recent 
      res.json(ads);
    } catch (err) {
      console.log(err);
    }
  };
  export const adsForSell = async (req, res) => {
    try {
      const ads = await Ad.find({ action: "Sell", published: true })
        .select(
          "-photos.Key -photos.key -photos.ETag -photos.Bucket")
        .populate("postedBy", "name username email phone company")
        .sort({ createdAt: -1 })//sort recent 
        .limit(12);
  
      
      res.json({ ads });
    } catch (err) {
      console.log(err);
    }
  };export const adsForRent = async (req, res) => {
    try {
      const ads = await Ad.find({ action: "Rent", published: true })
        .select(
          "-photos.Key -photos.key -photos.ETag -photos.Bucket ")
        .populate("postedBy", "name username email phone company")
        .sort({ createdAt: -1 })
        .limit(12);
  
      res.json({ ads});
    } catch (err) {
      console.log(err);
    }
  };
  export const search = async (req, res) => {
    console.log("req.query => ", req.query);
    try {
      // action address type price
      const { action, address, type, priceRange } = req.query;
  
  
      const ads = await Ad.find({
        action: action === "Buy" ? "Sell" : "Rent",
        type,
        price: {
          $gte: parseInt(priceRange[0]),
          $lte: parseInt(priceRange[1]),
        },
        published: true,
      })
        .limit(48)
        .sort({ createdAt: -1 })
        .select(
          "-photos.Key -photos.key -photos.ETag -photos.Bucket"
        );
      console.log("ads search result => ", ads);
      res.json(ads);
    } catch (err) {
      console.log(err);
    }
  };