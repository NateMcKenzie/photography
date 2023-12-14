import { useEffect, useState } from "react";


function SamplesPage() {

    const [imageURLs, setImageURLs] = useState([]);
    const [expandedImagePath, setExpandedImagePath] = useState("");


    async function getImages() {
        const res = await fetch("/sampleVault/", {
            method: "get",
            credentials: "same-origin",
        });
        const body = await res.json();
        setImageURLs(body.imageURLs);
    };

    useEffect(() => {
        getImages()
    }, []);

    function expandImage(e) {
        setExpandedImagePath(e.target.src);
    }
    function closeImage() {
        setExpandedImagePath("");
    }

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
            return <><div className="gallery">
                <div className="fillScroll">

                    {imageURLs.map((image, key) => (
                        <img className="galleryItem" key={key} src={image} onClick={expandImage} onContextMenu={(e) => e.preventDefault()} />
                    ))}
                </div>
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