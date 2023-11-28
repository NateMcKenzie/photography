import ImageGallery from "./ImageGallery"
import { useEffect, useState } from "react";

function HomePage() {
    const [expandedImagePath, setExpandedImagePath] = useState("");

    function selectImage(e) {
        setExpandedImagePath(e.target.src)
    }

    function closeImage(){
        setExpandedImagePath("");
    }

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
                <ImageGallery selectImage={selectImage} />
                <div className="sideBar">
                    <h2>Side Panel</h2>
                </div>
            </div>
        </>
    )
}

export default HomePage;