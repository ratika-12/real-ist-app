import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import { Avatar } from "antd";

export default function ProfileUpload({
  photo,
  setPhoto,
  uploading,
  setUploading,
}) {
  // context
  const [auth, setAuth] = useAuth();

  const handleUpload = (e) => {
    let file = e.target.files[0];
    if (file) {
      setUploading(true);
      // upload
      new Promise((resolve) => {
        Resizer.imageFileResizer(
          file,
          1080,
          720,
          "JPEG",
          100,
          0,
          async (uri) => {
            try {
              const { data } = await axios.post("/upload-image", {
                image: uri,
              });
              setPhoto(data);
              setUploading(false);
            } catch (err) {
              console.log("photo upload err => ", err);
              setUploading(false);
            }
          },
          "base64"
        );
      });
    } else {
      setUploading(false);
    }
  };

  const handleDelete = async (photoToDelete) => {
    const answer = window.confirm("Delete image?");
    if (!answer) return;
    setUploading(true);
    try {
      const { data } = await axios.post("/remove-image", photoToDelete);
      if (data?.ok) {
        setPhoto(null);
        setUploading(false);
      }
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  return (
    <>
      <div className="d-flex mt-4">
        <label className="btn btn-secondary mr-1">
          {uploading ? "Processing..." : "Upload photos"}
          <input
            onChange={handleUpload}
            type="file"
            accept="image/*"
            hidden
            disabled={uploading}
          />
        </label>
        <div className="d-block ml-2 mt-1">
            {photo?.Location && 
            <img
            src={photo?.Location}
            width={40}
            height={40}
            onClick={() => handleDelete(photo)}
            />
            }
        </div>
        {/* <pre>{JSON.stringify(photo, null, 4)}</pre> */}
      </div>
    </>
  );
}
