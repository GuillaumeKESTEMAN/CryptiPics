import React, { useState } from 'react';

function InputPicture() {
    const [picture, setPicture] = useState(false);
    const [pictureShow, setPictureShow] = useState("#");

    const verifFile = (file) => {
        const currentFile = file.target.files[0];
        if(currentFile.name.endsWith(".jpg") || currentFile.name.endsWith(".png")) {
            setPicture(currentFile);

            var fr = new FileReader();
            fr.onload = function (e) {
                setPictureShow(e.target.result);
            };
            fr.readAsDataURL(currentFile);
        } else {
            console.log("pas image");
            setPictureShow("#");
        }
    }

    return (
        <div className="InputPicture">
            <input type={"file"} onInput={verifFile} />
            {
                 pictureShow !== "#" && (<img src={pictureShow} />)
            }
        </div>
    );
}

export default InputPicture;
