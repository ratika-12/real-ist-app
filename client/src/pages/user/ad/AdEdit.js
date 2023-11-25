import { React, useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import ImageUpload from "../../../component/forms/Imageupload";
import axios from "axios";
import { useNavigate , useParams} from "react-router-dom";
import toast from "react-hot-toast"
import Sidebar from "../../../component/nav/sidebar";


export default function AdEdit({ action, type }) {
  const [ad, setAd] = useState({
    _id:"",
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

  const [loaded,setLoaded]= useState(false);
  const navigate = useNavigate();
  const params = useParams();
  useEffect(()=>{
    if(params?.slug){
        fetchAd()
    }
  },[params?.sulg]);

  const fetchAd = async ()=>{
    try{
        const{data}=await axios.get(`/ad/${params.slug}`)
        setAd(data?.ad)
        setLoaded(true);
    }catch(err){
        console.log(err)
    }
  }

  const handleClick= async()=>{
    try{
       setAd({...ad, loading:true})
       const{data}= await axios.put(`/ad/${ad._id}`,ad)
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
    e.preventDefault();
    try {
      if (!ad.photos?.length) {
        toast.error("Photo is required");
        return;
      } else if (!ad.price) {
        toast.error("Price is required");
        return;
      } else if (!ad.description) {
        toast.error("Description is required");
        return;
      } else {
        setAd({ ...ad, loading: true });
        const { data } = await axios.put(`/ad/${ad._id}`, ad);
        console.log("update response => ", data);
        if (data?.error) {
          toast.error(data.error);
          setAd({ ...ad, loading: false });
        } else {
          if (data?.ok) {
            toast.success("Ad updated successfully");
            navigate("/dashboard");
          }
        }
      }
    } catch (err) {
      console.log(err);
      setAd({ ...ad, loading: false });
    }
  };
  const handleDelete= async()=>{
    try{
       setAd({...ad, loading:true})
       const{data}= await axios.delete(`/ad/${ad._id}`)
       if(data?.error){
        toast.error(data.error);
        setAd({...ad, loading:false})
       }else{
        toast.success("Ad Delete Successfully")
        setAd({...ad, loading:false})
        navigate("/dashboard")
       }
    }catch(err){
        console.log(err)
        setAd({...ad, loading:false})
    }
  }
  return (
    <>
     <div className="contaienr-fluid mt-8">
      <h1 className="display-3 bg-primary text-light">Ad Edit</h1>
      <Sidebar />
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

        <div className="d-flex justify-content-between">
        <button onClick={handleClick} className="btn btn-primary ">
            {ad.loading? "Saving...":"Submit"}
        </button>
        <button onClick={handleDelete} className="btn btn-danger ">
            {ad.loading? "Deleting...":"Delete"}
        </button>
        </div>
      </form>
      </div>
      {/* <pre>{JSON.stringify(ad, null, 4)}</pre> */}
    </>
  );
}
