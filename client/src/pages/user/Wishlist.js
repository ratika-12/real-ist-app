import { useEffect, useState } from "react";
import Sidebar from "../../component/nav/sidebar";
import axios from "axios";
import AdCard from "../../component/cards/AdCard";
import { useAuth } from "../../context/Auth";

export default function Wishlist() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth?.token) fetchWishlist();
  }, [auth?.token]);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(`/wishlist`);
      setAds(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ marginTop: "-7%" }}
      >
        <div className="display-1">Loading...</div>
      </div>
    );
  }

  return (
    <div className="contaienr-fluid">
      <Sidebar />
      <div className="container mt-2 text-center">
        <h1>{ads.length} liked properties</h1>
      </div>

      <div className="container">
        <div className="row">
          {ads?.map((ad) => (
            <>
              <AdCard ad={ad} />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}