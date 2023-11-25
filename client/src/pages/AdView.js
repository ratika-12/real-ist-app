import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Gallery from "react-image-gallery"
import ImageGallery from "../component/misc/ImageGallery";
import AdFeatures from "../component/cards/AdFeatures";
import { formatNumber } from "../helpers/Ad";
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import LikeUnlike from "../component/misc/LikeUnlike";
import AdCard from "../component/cards/AdCard";
import ContactSeller from "../component/forms/ContactSeller";
dayjs.extend(relativeTime);


export default function AdView() {
    const [ad, setAd] = useState({});
    const [related, setRelated] = useState([]);
    const params = useParams();

    useEffect(() => {
        if (params?.slug) fetchAd();
    }, [params?.slug]);
    const fetchAd = async () => {
        try {
            const { data } = await axios.get(`/ad/${params.slug}`);
            setAd(data?.ad);
            setRelated(data?.related);
        } catch (err) {
            console.log(err)
        }
    }
    const generatePhotosArray = (photos) => {
        if (photos?.length > 0) {
            const x = photos?.length === 1 ? 2 : 4;
            let arr = [];
            photos.map((p) =>
                arr.push({
                    src: p.Location,
                    width: x,
                    height: x,
                })
            );
            return arr;
        } else {
            return [];
        }
    };
    return (
        <>
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-lg-4 mt-2">
                        {/* ad.type ? House/Land for sell/rent */}
                        <div>
                            <button className="btn btn-primary disabled mt-3">
                                {ad.type ? ad.type : ""} for {ad.action ? ad.action : ""}
                            </button>
                            <LikeUnlike ad={ad} />
                        </div>
                        <br />
                        <p className="text-danger h5 m-2 mt-3">
                            {ad?.sold ? "Off market" : "In market"}
                        </p>
                        <h1 className="mt-3">{ad.address}</h1>
                        <AdFeatures ad={ad} />
                        <h3 className="mt-3 h2">${formatNumber(ad?.price)}</h3>
                        <p className="d-flex justify-content-between mt-4">
                            <span>Added {dayjs(ad?.createdAt).fromNow()}</span>{" "}
                            <span>{ad?.views} Views</span>
                        </p>
                    </div>
                    <div className="col-lg-8">
                        <ImageGallery photos={generatePhotosArray(ad?.photos)} />
                    </div>

                </div>
            </div>
            {/* <pre>{JSON.stringify({ ad, related }, null, 4)}</pre> */}
            <div className="d-flex justify-content-center align-items-center  ">
                <ContactSeller ad={ad} />
            </div>

            <h4 className="text-center mt-4">Related Ads</h4>

            <div className="container">
                <div className="row">
                    {related?.map((ad) => (
                        <>
                            <AdCard ad={ad} />
                        </>
                    ))}
                </div>
            </div>
        </>
    );

}
