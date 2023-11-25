import { useState, useEffect } from "react";
import { useAuth } from "../context/Auth";
import axios from "axios";
import AdCard from "../component/cards/AdCard";
import { API } from "../config";
import SearchForm from "../component/forms/SerachForm";



export default function Buy() {
  // context
  const [auth, setAuth] = useAuth();
  //state
  const [ ads, setAds ]=useState();

  
  useEffect(()=>{
    fetchAds();
  },[])

  const fetchAds= async() =>{
    try{
      const {data} = await axios.get(`${API}/ads-for-sell`)
      setAds(data.ads)
    }catch(err){
      console.log(err)
    }
  }


  return (
    <div>
        <SearchForm/>
    <h2 className="display-1 bg-primary text-light h1">For Sell</h2>
    <div className="container">
      <div className="row">
        {ads?.map((ad) => (
          <AdCard ad={ad} key={ad._id} />
        ))}
      </div>
    </div>
  </div>
  );
}


