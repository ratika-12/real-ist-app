import { React, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import ImageUpload from "./Imageupload";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import { useAuth } from "../../context/Auth";


export default function AdForm({ action, type }) {
  const [auth, setAuth] = useAuth()
  const [ad, setAd] = useState({
    photos: [],
    price: "",
    bedrooms: "",
    bathrooms: "",
    carpark: "",
    landsize: "",
    landsizetype: "",
    title: "",
    description: "",
    features: "",
    nearby: "",
    loading: "",
    type,
    action,
  });
  const navigate = useNavigate();

  const handleClick= async()=>{
    try{
       setAd({...ad, loading:true})
       const{data}= await axios.post('/ad',ad)
       console.log("ad create respone =>", data)
       if(data?.error){
        toast.error(data.error);
        setAd({...ad, loading:false})
       }else{
        toast.success("Ad created succesfully")
        setAd({...ad, loading:false})
        navigate("/dashboard")
       }
    }catch(err){
        console.log(err)
    }
  }


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log( ad);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
      <ImageUpload ad={ad} setAd={setAd} />
        <CurrencyInput
          placeholder="Enter price"
          defaultValue={ad.price}
          className="form-control mb-3"
          onValueChange={(value) => setAd({ ...ad, price: value })}
        />
        {type === "House" ? (
            <>
            <input
          type="number"
          min="0"
          className="form-control mb-3"
          placeholder="Enter how many bedrooms"
          value={ad.bedrooms}
          onChange={(e) => setAd({ ...ad, bedrooms: e.target.value })}
          required
        />

        <input
          type="number"
          min="0"
          className="form-control mb-3"
          placeholder="Enter how many bathrooms"
          value={ad.toilets}
          onChange={(e) => setAd({ ...ad, bathrooms: e.target.value })}
          required
        />

        <input
          type="number"
          min="0"
          className="form-control mb-3"
          placeholder="Enter how many car parks"
          value={ad.carpark}
          onChange={(e) => setAd({ ...ad, carpark: e.target.value })}
        />
            </>
) : (
    ""
)}

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Size of land"
          value={ad.landsize}
          onChange={(e) => setAd({ ...ad, landsize: e.target.value })}
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter your address"
          value={ad.address}
          onChange={(e) => setAd({ ...ad, address: e.target.value })}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter title"
          value={ad.title}
          onChange={(e) => setAd({ ...ad, title: e.target.value })}
          required
        />

        <textarea
          className="form-control mb-3"
          value={ad.description}
          placeholder="Write description"
          onChange={(e) => setAd({ ...ad, description: e.target.value })}
        />

        <button onClick={handleClick} className="btn btn-primary ">
            {ad.loading? "Saving...":"Submit"}
        </button>
      </form>
      {/* <pre>{JSON.stringify(ad, null, 4)}</pre> */}
    </>
  );
}
