import ImageGallery from "./ImageGallery"
import { useEffect, useState } from "react";

function HomePage() {
    const [expandedImagePath, setExpandedImagePath] = useState("");
    //Hoisted to prevent reloading when opening a single-image and returning.
    const [imageURLs, setImageURLs] = useState([]);


    /**
     * Expands the image by setting the expanded image path.
     * 
     * @param {Event} e - The event object triggered by the image click.
     */
    function expandImage(e) {
        const source = e.target.src
        const truncated = e.target.src.substring(0, source.length - 6)
        setExpandedImagePath(truncated)
    }

    /**
     * Closes the image by setting the expanded image path to an empty string.
     */
    function closeImage() {
        setExpandedImagePath("");
    }

    /**
     * Fetches images from the server and updates the image URLs state.
     * @returns {Promise<void>} A promise that resolves when the image URLs are updated.
     */
    async function getImages() {
        const res = await fetch("/vault/", {
            method: "get",
            credentials: "same-origin",
        });
        const body = await res.json();
        setImageURLs(body.imageURLs);
    };

    //Load Image URLs on first load
    useEffect(() => {
        getImages()
    }, []);

    //Default message used if imageURLs is not yet known, otherwise a gallery or single-image is shown.
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
    } else if (imageURLs.length > 0) {
        MainComponent = () => { return <><ImageGallery expandImage={expandImage} imageURLs={imageURLs} /> </>; };
    } else {
        MainComponent = () => { return <><h1>You do not have any photos yet. Visit the reservations page to make a reservation.</h1></> }
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