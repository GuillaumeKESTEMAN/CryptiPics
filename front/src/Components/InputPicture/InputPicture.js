import React, { useState } from 'react';
import ErrorMessage from "../Messages/Errors/ErrorMessage";

function InputPicture() {
    const formats = ["png","jpeg","jpg"];

    const [picture, setPicture] = useState(false);
    const [pictureShow, setPictureShow] = useState("#");
    const [errorMessage, setSetErrorMessage] = useState(false);
    const [errorMessageState, setSetErrorMessageState] = useState(false);
    const fileLimitSize = 1;    // en Mo

    const verifFile = (file) => {
        const currentFile = file.target.files[0];
        console.log(currentFile);
        if(currentFile.name.endsWith(".jpg") || currentFile.name.endsWith(".png")) {
            if(currentFile.size < fileLimitSize * 1000000) {
                if(errorMessageState) {
                    setSetErrorMessageState(false);
                }
                setPicture(currentFile);

                var fr = new FileReader();
                fr.onload = function (e) {
                    setPictureShow(e.target.result);
                };
                fr.readAsDataURL(currentFile);
            } else {
                if(!errorMessageState) {
                    setSetErrorMessageState(true);
                }
                setSetErrorMessage("Votre image est trop volumineuse");
            }
        } else {
            setPictureShow("#");

            if(!errorMessageState) {
                setSetErrorMessageState(true);
            }
            setSetErrorMessage("Votre format d'image n'est pas utilisable, les formats possibles sont :" + formats.map((value, index, array) => {
                value = " ." + value;
                return value;
            }));
        }
    }

    return (
        <div className="InputPicture">
            <input type={"file"} accept={formats.map((value, index, array) => {
                value = "image/" + value;
                return value;
            })} onInput={verifFile} />
            {
                pictureShow !== "#" && (<img src={pictureShow} />)
            }
            {
                errorMessageState && (<ErrorMessage message={errorMessage}/>)
            }
        </div>
    );
}

export default InputPicture;
