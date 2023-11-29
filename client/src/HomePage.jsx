import ImageGallery from "./ImageGallery"
import { useEffect, useState } from "react";

function HomePage() {
    const [expandedImagePath, setExpandedImagePath] = useState("");
    //Hoisted to prevent reloading when opening single images
    const [imageURLs, setImageURLs] = useState([]);

    function selectImage(e) {
        setExpandedImagePath(e.target.src)
    }

    function closeImage(){
        setExpandedImagePath("");
    }

    async function getImages() {
        const res = await fetch("/vault/", {
            method: "get",
            credentials: "same-origin",
        });
        const body = await res.json();
        setImageURLs(() => body.imageURLs);
    };

    useEffect(()=>{getImages()},[]);

    if (expandedImagePath) {
        return <>
            <div className="grid">
                <div className="expandedView">
                    <div>
                        <a className="buttonLike" download="true" href={expandedImagePath} >Save</a>
                        <span className="buttonLike" onClick={closeImage}>Close</span>
                    </div>
                    <img className="expandedImage" src={expandedImagePath} />
                </div>
                <div className="sideBar">
                    <h2>Side Panel</h2>
                </div>
            </div>
        </>
    }
    
    return (
        <>
            <div className="grid">
                <ImageGallery selectImage={selectImage} imageURLs={imageURLs} />
                <div className="sideBar">
                    <h2>Side Panel</h2>
                </div>
            </div>
        </>
    )
}

export default HomePage;