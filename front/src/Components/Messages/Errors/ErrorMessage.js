import React, { useState } from 'react';

function ErrorMessage(props) {


    return (
        <>
            <p style={{color: "red"}}>{props.message}</p>
        </>
    );
}

export default ErrorMessage;
