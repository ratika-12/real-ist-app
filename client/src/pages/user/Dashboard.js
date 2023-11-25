import { useEffect, useState } from "react";
import Sidebar from "../../component/nav/sidebar";
import axios from "axios";
import UserAdCard from "../../component/cards/UserAdCard";

export default function Dashboard() {
  const [ads, setAds] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const adsPerPage = 2; // Number of ads to load per page

  useEffect(() => {
    fetchAds(page);
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchAds = async (currentPage) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/user-ads/${currentPage}`);
      if (currentPage === 1) {
        // For the first page, only load 2 ads
        setAds(data.ads.slice(0, adsPerPage));
      } else {
        // For subsequent pages, append 2 ads at the end
        setAds((prevAds) => [...prevAds, ...data.ads.slice(0, adsPerPage)]);
      }
      setTotal(data.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div>
  <h1 className="display-3 bg-primary text-light ">Dashboard</h1>

      <Sidebar />
      <div className="container mt-2 text-center">
        <h1>
          {total > 0 ? `You have ${total} ads` : "You have not posted any ads"}
        </h1>
      </div>

      <div className="container">
        <div className="row">
          {ads.map((ad) => (
            <UserAdCard ad={ad} key={ad._id} />
          ))}
        </div>
        {ads.length < total ? (
          <div className="row">
            <div className="col text-center mt-4 mb-4">
              <button
                disabled={loading}
                className="btn btn-warning"
                onClick={loadMore}
              >
                {loading ? "Loading..." : `${ads.length} / ${total} Load More`}
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
