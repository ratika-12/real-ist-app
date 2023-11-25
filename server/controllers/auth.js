import * as config from "../config.js";
import jwt from "jsonwebtoken";
import { emailTemplate } from "../helpers/email.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import validator from "email-validator";
import Ad from "../models/ad.js";
import { token } from "morgan";

export const welcome = (req, res) => {
  return res.json({
    data: "hello from node api",
  });
};
const tokenAndUserResponse = (req, res, user) => {
  const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Clear sensitive data from the newUser object
  user.password = undefined;
  user.resetCode = undefined;

  return res.json({
    token,
    refreshToken,
    user, // Return the newUser object, not 'user'
  });
};
//send Email from here
export const preRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validaton
    if (!validator.validate(email)) {
      return res.json({ error: "A valid email is required" });
    }
    if (!password) {
      return res.json({ error: "password is reuired" });
    }

    const token = jwt.sign({ email, password }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    config.AWSSES.sendEmail(
      emailTemplate(
        email,
        `<p>Please click the link below to activate your account.</p>
      <a href="${config.CLIENT_URL}/auth/activate-account/${token}">
        Activate your account.
      </a>`,
        config.replyTo,
        "Activate your account"
      ),
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json({ ok: false });
        } else {
          console.log(data);
          return res.json({ ok: true });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong." });
  }
};

export const register = async (req, res) => {
  try {
    // decode email, password from token
    const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);
    // hash password
    const hashedPassword = await hashPassword(password);
    // create user and save
    const user = await new User({
      username: nanoid(6),
      email,
      password: hashedPassword,
    }).save();
    // create token
    const jwtToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "1d",
    });
    // create refresh token
    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "30d",
    });
    // hide fields
    user.password = undefined;
    user.resetCode = undefined;
    // send response
    return res.json({
      user,
      token: jwtToken,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "Invalid or expired token. Try again." });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: "User not found." });
    }

    // Compare passwords
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.json({ error: "Wrong password" });
    }

    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong." });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "Could not find user with that email" }); // Added 'return'
    } else {
      const resetCode = nanoid(6);

      const token = jwt.sign({ _id: user._id, resetCode }, config.JWT_SECRET, {
        expiresIn: "1h",
      });
      // save to user db
      user.resetCode = resetCode;
      await user.save(); // Await the save operation

      // send email
      config.AWSSES.sendEmail(
        emailTemplate(
          email,
          `
          <p>Please click the link below to access your account.</p>
          <a href="${config.CLIENT_URL}/auth/access-account/${token}">Access my account</a>
      `,
          config.REPLY_TO,
          "Access your account"
        ),
        (err, data) => {
          if (err) {
            return res.json({ error: "Provide a valid email address" });
          } else {
            return res.json({ success: "Check email to access your account" }); // Changed 'error' to 'success'
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

// access token api
export const accessAccount = async (req, res) => {
  try {
    const { _id, resetCode } = jwt.verify(
      req.body.resetCode,
      config.JWT_SECRET
    );
    // Find the user by resetCode and update the resetCode field
    const user = await User.findOneAndUpdate({ _id }, { resetCode: "" });

    if (!user) {
      return res.json({ error: "Invalid reset code" });
    }

    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went in access wrong. Try again." });
  }
};
export const refreshToken = async (req, res) => {
  try {
    const { _id } = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);
    const user = await User.findById(_id);
    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: "Refresh token failed" });
  }
};
export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: "Unauthorized" });
  }
};
export const publicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: "user not found" });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    console.log(password);
    if (!password) {
      return res.json({ error: "password is reuired" });
    }
    else if (password && password?.length < 6) {
      return res.json({ error: "password should be minimun 6 characters" });
    }

     const user = await User.findByIdAndUpdate(req.user._id, {
      password: await hashPassword(password),
    });
    
    res.json({message: "Password updated successfully", data:user});

  } catch (err) {
    console.log(err);
    res.status(403).json({ error: "Unauthorized" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    res.json({message: "Profile updated successfully", data:user});
  } catch (err) {
    console.log(err);
    if (err.codeName === "DuplicateKey") {
      return res.json({ error: "username and email is already taken" });
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  }
};
export const agents = async (req, res) => {
  try {
    const users = await User.find({ role: "Seller" }).select(
      "-password -role -enquiredProperties -wishlist -photo.ETag -photo.Key -photo.key -photo.Bucket"
    );
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

// to show how many ads one agent have
export const agentAdCount = async (req, res) => {
  try {
    const ads = await Ad.find({ postedBy: req.params._id }).select("_id");
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const agent = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -role -enquiredProperties -wishlist -photo.ETag -photo.Key -photo.key -photo.Bucket"
    );
    
    if (!user) {
      // User not found
      return res.status(404).json({ error: "User not found" });
    }

    const ads = await Ad.find({ postedBy: user._id }).select(
      "-photos.Key -photos.key -photos.ETag -photos.Bucket"
    );
    res.json({ user, ads });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
