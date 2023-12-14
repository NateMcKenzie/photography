import { useEffect, useState } from "react";
import cookie from "cookie";


function ImageGallery(props) {
    const [selectMode, setSelectMode] = useState(false);
    const [isImageSelected, setIsImageSelected] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const [shifted, setShifted] = useState(false);
    const [controlled, setControlled] = useState(false);
    const [zipInProgress, setZipInProgess] = useState(false);

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
    useEffect(() => {
        setAllSelected(!(isImageSelected.includes(false)));
    }, [isImageSelected]);

    /*=============
    Define important functions
    ============ */

    //TODO: Works well enough, but not like a true shift selection.
    /**
     * Handle selecting and deselecting images. Approximating what one would expect when using shfit and control.
     * @param {object} _ - Click event not used by function.
     * @param {number} key - The key of the image to be added or removed from the selection.
     */
    function addToSelection(_, key) {
        console.log(typeof _)
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

    /**
     * Toggles the selection of all images in the gallery.
     */
    function toggleSelectAll() {
        const newIndices = isImageSelected.fill(!allSelected);
        setIsImageSelected(newIndices);
        setAllSelected(!allSelected);
    }

    /**
     * Checks if any image is selected.
     * @returns {boolean} True if no image is selected, false otherwise.
     */
    function noneSelected() {
        const selectedList = isImageSelected.filter((value) => value);
        return (selectedList.length == 0);
    }

    /**
     * Downloads the selected images as a zip file.
     */
    async function download() {
        if (noneSelected()) return;
        setZipInProgess(true);

        const downloadList = [];
        isImageSelected.forEach((isSelected, i) => {
            if (isSelected) {
                downloadList.push(props.imageURLs[i]);
            }
        });

        //Uses somewhat of a "hacky" way to download the zip once it the server has finished preparing it. Then updates zipInProgress.
        fetch("/zip/", {
            method: "post",
            credentials: "same-origin",
            body: JSON.stringify(downloadList),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken
            }
        }).then((res) => res.blob()).then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            //Create link element pointing to file.
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'images.zip');
            //Add link element to document and "click" it.
            document.body.appendChild(link);
            link.click();
            //Clean up
            link.parentNode.removeChild(link);
            setZipInProgess(false);
        });
    }

    /**
     * If server is preparing the zip file, return an overlay message indicating as much.
     * @returns {JSX.Element|null} The overlay message or null if zipInProgress is false.
     */
    function Overlay() {
        if (zipInProgress) {
            return <>
                <div className="zipOverlay">
                    The server is preparing your images for download.<br />
                    Download will commence automatically in a few moments.
                </div>
            </>
        } else {
            return null;
        }
    }

    /*=============
    Compose return statement
    ============ */

    return <>

        <Overlay />
        <div className="gallery">
            <nav className="galleryBar">
                <div className="margined">
                    <span className="buttonLike" onClick={toggleSelectAll}>{allSelected ? "Deselect All" : "Select All"}</span>
                    <span className="buttonLike" onClick={() => setSelectMode(!selectMode)}>{selectMode ? "Default Mode" : "Select Mode"}</span>
                </div>
                <span className="buttonLike" onClick={download}>{zipInProgress ? "Zipipng" : "Download"}</span>
            </nav>
            <div className="galleryScroll">
                {props.imageURLs.map((image, key) => (
                    <img className={"galleryItem" + (isImageSelected[key] ? " selected" : "")} key={key} src={image + "/thumb/"} onClick={selectMode ? e => addToSelection(e, key) : props.expandImage} />
                ))}
            </div>
        </div>
    </>

}

export default ImageGallery;