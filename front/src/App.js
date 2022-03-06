import React, { useState } from 'react';
import InputPicture from "./Components/InputPicture/InputPicture";
import './App.css';
import API from "./Utils/API";

function App() {
    const [picture, setPicture] = useState("#");

    const cryptRequest = async () => {
        let data = await API.post('/picture/crypt',{"picture":picture},{});
    };

    const submitFunction = (params) => {
        if(picture !== "#") {
            cryptRequest();
        }
        console.log(params);
    }

  return (
    <div className="App  bg-gray-100 flex flex-row justify-center h-screen w-screen">
        <form className='' action={"#"}>
            <InputPicture picture={picture} setPicture={setPicture}/>
            <button className='justify-self-center w-[10rem] mx-auto mt-1 rounded-lg p-1 bg-gray-200 hover:bg-gray-300 transition duration-500' type={"button"} onClick={submitFunction}>Chiffrer</button>
        </form>
    </div>
  );
}

export default App;
