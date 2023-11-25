import { useState, useEffect } from "react";
import { useAuth } from "../context/Auth";
import axios from "axios";
import AdCard from "../component/cards/AdCard";
import { API } from "../config";
import SearchForm from "../component/forms/SerachForm";



export default function Home() {
  // context
  const [auth, setAuth] = useAuth();
  //state
  const [ adsForSell, setAdsForSell ]=useState();
  const [ adsForRent, setAdsForRent ]=useState();

  console.log("JFZFJJFJZFJZBFJ");
  
  useEffect(()=>{
    fetchAds();
  },[])

  const fetchAds= async() =>{
    try{
      const {data} = await axios.get(`${API}/ads`)
      console.log("datadatadatadatadatadata",data);
      setAdsForSell(data.adsForSell)
      setAdsForRent(data.adsForRent)
    }catch(err){
      console.log(err)
    }
  }


  return (
    <div>
      <SearchForm/>
    </div>
  );
}


