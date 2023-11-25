import Resizer from "react-image-file-resizer";
import axios from "axios";

export default function ImageUpload({ ad, setAd }) {
  const handleUpload = async (e) => {
    let files = e.target.files;
    files = [...files];
    if (files?.length) {
      setAd((prev) => ({ ...prev, uploading: true, photos: prev.photos || [] })); // Initialize photos if it's not defined
      files.map((f) => {
        // upload
        new Promise((resolve) => {
          Resizer.imageFileResizer(
            f,
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
                setAd((prev) => ({
                  ...prev,
                  photos: [data, ...(prev.photos || [])], // Initialize photos if it's not defined
                  uploading: false,
                }));
              } catch (err) {
                console.log("photo upload err => ", err);
                setAd((prev) => ({ ...prev, uploading: false }));
              }
            },
            "base64"
          );
        });
      });
    } else {
      setAd((prev) => ({ ...prev, uploading: false }));
    }
  };

  const handleDelete = async (file) => {
    const answer = window.confirm("Delete image?");
    if (!answer) return;
    setAd((prev) => ({ ...prev, uploading: true }));
    try {
      const { data } = await axios.post("/remove-image", file);
      if (data?.ok) {
        setAd((prev) => ({
          ...prev,
          photos: (prev.photos || []).filter((p) => p.Key !== file.Key), // Initialize photos if it's not defined
          uploading: false,
        }));
      }
    } catch (err) {
      console.log(err);
      setAd((prev) => ({ ...prev, uploading: false }));
    }
  };
  console.log(ad);

  return (
    <>
      <div className="d-flex mt-4">
        <label className="btn btn-secondary">
          {ad.uploading
            ? "Uploading..."
            : ad.removing
            ? "Removing..."
            : "Upload photos"}
          <input
            onChange={handleUpload}
            type="file"
            accept="image/*"
            multiple
            hidden
          />
        </label>
        
        <div className="d-block ml-2 ">{ad.photos?.map((file, index) => (
        <img src={file?.Location} key={index} width={50} height={50} 
        onClick={()=>{handleDelete(file)}} />
        ))}
       
        </div>
      </div>
    </>
  );
}
