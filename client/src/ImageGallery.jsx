import { useEffect, useState } from "react";

function ImageGallery (props){
    const [imageURLs, setImageURLs] = useState([]);

    async function getImages(){
        const res = await fetch("/vault/",{
            method:"get",
            credentials: "same-origin",
        });
        const body = await res.json();
        setImageURLs(body.imageURLs);
    };

    useEffect(() => {
        getImages();
    },[]);

    const selectImage = props.selectImage

    return <>
    
    <div className="gallery">
        {imageURLs.map( image => (
            <img className="galleryItem" key={image} src={image} onClick={selectImage}/>
        ))}
    </div>
    </>
    
}

export default ImageGallery;