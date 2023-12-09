import ImageGallery from "./ImageGallery"
import { useEffect, useState } from "react";

function HomePage() {
    const [expandedImagePath, setExpandedImagePath] = useState("");
    //Hoisted to prevent reloading when opening a single-image and returning.
    const [imageURLs, setImageURLs] = useState([]);


    function expandImage(e) {
        const source = e.target.src
        const truncated = e.target.src.substring(0,source.length - 6)
        setExpandedImagePath(truncated)
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
    if (expandedImagePath) {
        MainComponent = () => {
            return <>
                <div className="expandedView home">
                    <div>
                        <a className="buttonLike" download="true" href={expandedImagePath} >Save</a>
                        <span className="buttonLike" onClick={closeImage}>Close</span>
                    </div>
                    <img className="expandedImage" src={expandedImagePath} />
                </div>
            </>;
        };
    } else if (imageURLs.length > 0){
        console.log("Image URLs present: " + imageURLs)
        MainComponent = () => { return <><ImageGallery expandImage={expandImage} imageURLs={imageURLs} /> </>; };
    } else{
        MainComponent = () => { return <><h1>You do not have any photos yet. Visit the reservations page to make a reservation.</h1></>}
    }
    //TODO: Make side panel which has folders
    return (
        <>
            <div className="grid">
                <MainComponent />

            </div>
        </>
    )
}

export default HomePage;