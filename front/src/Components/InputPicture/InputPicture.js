import React, { useState } from 'react';
import ErrorMessage from "../Messages/Errors/ErrorMessage";

function InputPicture(props) {
    const formats = ["png", "jpeg", "jpg"];

    const [errorMessage, setSetErrorMessage] = useState([]);
    const [errorMessageState, setSetErrorMessageState] = useState(false);
    const fileLimitSize = 1; // en Mo

    const verifFile = (file) => {
        const currentFile = file.target.files[0];
        console.log(currentFile);
        if (currentFile.name.endsWith(".jpg") || currentFile.name.endsWith(".png")) {
            if (currentFile.size < fileLimitSize * 2000000) {
                if (errorMessageState) {
                    setSetErrorMessageState(false);
                }

                var fr = new FileReader();
                fr.onload = function (e) {
                    props.setPicture(e.target.result);
                };
                fr.readAsDataURL(currentFile);
            } else {
                if (!errorMessageState) {
                    setSetErrorMessage(["Votre image est trop volumineuse"]);
                    setSetErrorMessageState(true);
                }
            }
        } else {
            props.setPicture("#");

            if (!errorMessageState) {
                setSetErrorMessage(["Votre format d'image n'est pas utilisable", "les formats possibles sont :" + formats.map((value) => {
                    value = " ." + value;
                    return value;
                })]);
                setSetErrorMessageState(true);
            }
        }
    }

    return (
        <div className="InputPicture  w-[20rem] mx-[1rem] flex flex-col justify-center items-center">
            <input className='' type={"file"} accept={formats.map((value, index, array) => {
                value = "image/" + value;
                return value;
            })} onInput={verifFile} />
            {
                props.picture !== "#" && (<img src={props.picture} />)
            }
            {
                errorMessageState && (<ErrorMessage messages={errorMessage} />)
            }
        </div>
    );
}

export default InputPicture;
