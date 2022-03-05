import React, { useState } from 'react';
import InputPicture from "./Components/InputPicture/InputPicture";
import './App.css';
import API from "./Utils/API";

function App() {
    const [picture, setPicture] = useState("#");

    const cryptRequest = async () => {
        let data = await API.post('/picture',{"picture":picture},{});
    };

    const submitFunction = (params) => {
        if(picture !== "#") {
            cryptRequest();
        }
        console.log(params);
    }

  return (
    <div className="App">
        <form action={"#"}>
            <InputPicture picture={picture} setPicture={setPicture}/>
            <button type={"button"} onClick={submitFunction}>Chiffrer</button>
        </form>
    </div>
  );
}

export default App;
