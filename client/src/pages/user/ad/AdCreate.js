import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../component/nav/sidebar";

export default function AdCreate() {
    const [sell,setSell]=useState(false);
    const [rent,setRent]=useState(false);

    const navigate = useNavigate();
    const handleSell= ()=>{
      setSell(true);
      setRent(false);
    }
    const handleRent= ()=>{
      setRent(true);
      setSell(false);
    }


  return (
    <div className="contaienr-fluid">
      <h1 className="display-3 bg-primary text-light">Ad create</h1>
      <Sidebar />

      <div className="d-flex justify-content-center align-items-center vh-100 "style={{marginTop:"-14%"}} >
        <div className="col-lg-6">
          <button onClick={handleSell}className="btn btn-primary btn-lg col-12 p-3 ">
                Sell
          </button>
          {sell && <div className="my-1">
            <button onClick={()=> navigate("/ad/create/sell/House")} className="btn btn -primary btn-lg col-6 p-2">House</button>
            <button onClick={()=> navigate("/ad/create/sell/Land")} className="btn btn -primary btn-lg col-6 p-2">Land</button>
            </div>}
          </div>
          <div className="col-lg-6">
          <button onClick={handleRent}className="btn btn-primary btn-lg col-12 p-3 ">
                Rent
          </button>
          {rent && <div className="my-1">
            <button onClick={()=> navigate("/ad/create/rent/House")} className="btn btn -primary btn-lg col-6 p-2">House</button>
            <button onClick={()=> navigate("/ad/create/rent/Land")}className="btn btn -primary btn-lg col-6 p-2">Land</button>
            </div>}

        </div>

      </div>
    </div>
  );
}