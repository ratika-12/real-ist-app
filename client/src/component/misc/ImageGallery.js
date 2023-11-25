import React, { useState,  useCallback } from "react";
import { useParams } from "react-router-dom";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";


const ImageGallery = ({photos}) => {
   
    const [current, setCurrent] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const params = useParams();
    

    const openLightbox = useCallback((event, { Photos, index }) => {
        setCurrent(index);
        setIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrent(0);
        setIsOpen(false);
    };

    return (
        <>  
            <Gallery photos={photos} onClick={openLightbox} />
             {/* {photos?.map((data) => (
               <img src={data.src} width={500} height={200} className="mr-1" />
         ))}  */}
            <ModalGateway>
                {isOpen ? (
                    <Modal onClose={closeLightbox}>
                        <Carousel
                            currentIndex={current}
                            views={photos.map((x) => ({
                                ...x,
                                srcset: x.srcSet,
                                caption: x.title,
                            }))}
                        />
                    </Modal>
                ) : null}
            </ModalGateway>
          
        </>
    );
};

export default ImageGallery;
