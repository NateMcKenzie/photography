import { useEffect, useState } from "react";
import cookie from "cookie";


function ImageGallery(props) {
    const [selectMode, setSelectMode] = useState(false);
    const [isImageSelected, setIsImageSelected] = useState([]);
    const [shifted, setShifted] = useState(false);
    const [controlled, setControlled] = useState(false);
    const [allSelected, setAllSelected] = useState(false);

    /*=============
    Set up effects and keylisteners
    ============ */
    function keyDown(e) {
        if (e.key == "Shift") {
            setShifted(true);
            setSelectMode(true)
        }
        if (e.key == "Control") {
            setControlled(true);
            setSelectMode(true)
        }
    }

    function keyUp(e) {
        if (e.key == "Shift") {
            setShifted(false);
        }
        if (e.key == "Control") {
            setControlled(false);
        }
    }

    //Initialization effects.
    useEffect(() => {

        const initialized = []
        for (let i = 0; i < props.imageURLs.length; i++) {
            initialized.push(false);
        }
        setIsImageSelected(initialized);

        window.addEventListener("keydown", keyDown)

        window.addEventListener("keyup", keyUp)

        return () => {
            window.removeEventListener("keydown", keyDown)
            window.removeEventListener("keyup", keyUp)
        }
    }, []);

    //Needed for case where both shift and control are held/released
    useEffect(() => {
        if (!shifted && !controlled) {
            setSelectMode(false);
        }
    }, [shifted, controlled]);

    //Check if all images are selected on change.
    useEffect(() => { setAllSelected(!isImageSelected.includes(false)); }, [isImageSelected]);

    /*=============
    Define important functions
    ============ */

    //Selection heavylifter
    function addToSelection(_, key) {
        if (isImageSelected.includes(true)) {
            if (isImageSelected[key]) {
                if (shifted) {
                    const newSelected = [...isImageSelected];
                    const max = newSelected.lastIndexOf(true);
                    for (let i = max; i > key; i--) {
                        newSelected[i] = false;
                    }
                    setIsImageSelected(newSelected);
                }
                else {
                    const newSelected = [...isImageSelected];
                    newSelected[key] = false;
                    setIsImageSelected(newSelected);
                }
            } else {
                if (shifted) {
                    const newSelected = [...isImageSelected];
                    const max = newSelected.lastIndexOf(true);
                    for (let i = max; i < key + 1; i++) {
                        newSelected[i] = true;
                    }
                    setIsImageSelected(newSelected);
                } else {
                    const newSelected = [...isImageSelected];
                    newSelected[key] = true;
                    setIsImageSelected(newSelected);
                }
            }
        } else {
            const newSelected = [...isImageSelected];
            newSelected[key] = true;
            setIsImageSelected(newSelected);
        }
    }

    function toggleSelectAll() {
        const newIndices = isImageSelected.fill(!allSelected);
        setIsImageSelected(newIndices);
        setAllSelected(!allSelected);
    }

    //TODO: Many Hi-res pictures will probably be slow to zip and download. Show user that download is working in background
    async function download() {
        const downloadList = [];
        isImageSelected.forEach((isSelected, i) => {
            if (isSelected) {
                downloadList.push(props.imageURLs[i]);
            }
        });
        await fetch("/zip/", {
            method: "post",
            credentials: "same-origin",
            body: JSON.stringify(downloadList),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken
            }
        }).then((res) => res.blob())
        .then((blob) => {const url = window.URL.createObjectURL(new Blob([blob])); const link = document.createElement('a');link.href = url; link.setAttribute('download', 'images.zip'); document.body.appendChild(link);link.click();link.parentNode.removeChild(link);});
    }

    /*=============
    Create html
    ============ */

    const selectImage = props.selectImage;

    return <>

        <div className="gallery">
            <nav className="galleryBar">
                <div className="margined">
                    <span className="buttonLike" onClick={toggleSelectAll}>{allSelected ? "Deselect All" : "Select All"}</span>
                    <span className="buttonLike" onClick={() => setSelectMode(!selectMode)}>{selectMode ? "Default Mode" : "Select Mode"}</span>
                </div>
                <span className="buttonLike" onClick={download}>Download</span>
            </nav>
            <div>
                {props.imageURLs.map((image, key) => (
                    <img className={"galleryItem" + (isImageSelected[key] ? " selected" : "")} key={key} src={image} onClick={selectMode ? e => addToSelection(e, key) : selectImage} />
                ))}
            </div>
        </div>
    </>

}

export default ImageGallery;