import ImageGallery from "./ImageGallery"
import { useEffect, useState } from "react";

function HomePage() {
    const [expandedImagePath, setExpandedImagePath] = useState("");
    //Hoisted to prevent reloading when opening a single-image and returning.
    const [imageURLs, setImageURLs] = useState([]);


    function expandImage(e) {
        setExpandedImagePath(e.target.src)
    }

    function closeImage() {
        setExpandedImagePath("");
    }

    //TODO: Many hi-res pictures are slow to load. Pages may be necessary. Thumbnails should help.
    async function getImages() {
        const res = await fetch("/vault/", {
            method: "get",
            credentials: "same-origin",
        });
        const body = await res.json();
        setImageURLs(body.imageURLs);
    };

    useEffect(() => {
        getImages()
    }, []);

    //Default used if imageURLs is not yet known, otherwise a gallery or single-image is shown.
    let MainComponent = () => <><p>Obtaining data from server. Please wait.</p></>;
    //TODO: Single-image view is not perfect with hi-res.
    if (expandedImagePath) {
        MainComponent = () => {
            return <>
                <div className="expandedView">
                    <div>
                        <a className="buttonLike" download="true" href={expandedImagePath} >Save</a>
                        <span className="buttonLike" onClick={closeImage}>Close</span>
                    </div>
                    <img className="expandedImage" src={expandedImagePath} />
                </div>
            </>;
        };
    } else if (imageURLs){
        MainComponent = () => { return <><ImageGallery expandImage={expandImage} imageURLs={imageURLs} /> </>; };
    }
    //TODO: Make side panel have folders
    return (
        <>
            <div className="grid">
                <MainComponent />
                <div className="sideBar">
                    <h2>Side Panel</h2>
                </div>
            </div>
        </>
    )
}

export default HomePage;