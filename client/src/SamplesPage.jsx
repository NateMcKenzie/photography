import { useEffect, useState } from "react";


function SamplesPage() {

    const [imageURLs, setImageURLs] = useState([]);
    const [expandedImagePath, setExpandedImagePath] = useState("");

    //Initial set-up on first load
    useEffect(() => {
        getImages()
    }, []);

    /**
     * Fetches the image URLs from the server.
     * @returns {Promise<void>} A promise that resolves when the image URLs are fetched and set.
     */
    async function getImages() {
        const res = await fetch("/sampleVault/", {
            method: "get",
            credentials: "same-origin",
        });
        const body = await res.json();
        setImageURLs(body.imageURLs);
    };

    /**
     * Expands the image when clicked.
     * @param {Event} e - The click event.
     */
    function expandImage(e) {
        setExpandedImagePath(e.target.src);
    }

    /**
     * Closes the image by setting the expanded image path to an empty string.
     */
    function closeImage() {
        setExpandedImagePath("");
    }

    //Use a default message if image URLs have not been received. Otherwise show the gallery view, or full image.
    let MainComponent = () => <><p>Obtaining data from server. Please wait.</p></>;
    if (expandedImagePath) {
        MainComponent = () => {
            return <>
                <div className="expandedView samples">
                    <div>
                        <span className="buttonLike" onClick={closeImage}>Close</span>
                    </div>
                    <img className="expandedImage" src={expandedImagePath} onContextMenu={(e) => e.preventDefault()} />
                </div>
            </>;
        };
    } else if (imageURLs) {
        MainComponent = () => {
            return <>
                <div className="galleryScroll">
                    {imageURLs.map((image, key) => (
                        <img className="galleryItem" key={key} src={image} onClick={expandImage} onContextMenu={(e) => e.preventDefault()} />
                    ))}
            </div>
            </>
        };
    }

    return (
        <>
            <div className="samplePage">
                <nav className="galleryBar">
                    <a className="buttonLike" href="https://www.instagram.com/_.tana.with.a.camera._/">Instagram</a>
                </nav>
                <MainComponent />
                
            </div>
        </>
    )
}

export default SamplesPage;
