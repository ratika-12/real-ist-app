import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "../../context/Auth";
import toast from "react-hot-toast";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

export default function LikeUnlike({ ad }) {
  // context
  const [auth, setAuth] = useAuth();
  // hooks
  const navigate = useNavigate();

  const handleLike = async (adId) => {
    if (auth.user === null) {
        navigate("/login", {
          state: `/ad/${ad.slug}`,
        });
        return;
      }
    try {
      const { data } = await axios.post("/wishlist", { adId: ad._id });
      console.log("added to wishlist => ", data);
      setAuth({ ...auth, user: data });
      const fromLS = JSON.parse(localStorage.getItem("auth"));
      if (fromLS) {
        fromLS.user = data;
        localStorage.setItem("auth", JSON.stringify(fromLS));
      }
      toast.success("Added to your wishlist");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  const handleUnlike = async (adId) => {
    if (auth.user === null) {
        navigate("/login", {
          state: `/ad/${ad.slug}`,
        });
        return;
      }
    try {
      const { data } = await axios.delete(`/wishlist/${ad._id}`);
      console.log("removed from wishlist => ", data);
      setAuth({ ...auth, user: data });
      const fromLS = JSON.parse(localStorage.getItem("auth"));
      if (fromLS) {
        fromLS.user = data;
        localStorage.setItem("auth", JSON.stringify(fromLS));
      }
      toast.error("Removed from your wishlist");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <>
      {auth?.user?.wishlist?.includes(ad?._id) ? (
        <span onClick={() => handleUnlike(ad)}>
          <FcLike className="pointer h2 m-2" />
        </span>
      ) : (
        <span onClick={() => handleLike(ad)}>
          <FcLikePlaceholder className="pointer h2 m-2" />
        </span>
      )}
    </>
  );
}