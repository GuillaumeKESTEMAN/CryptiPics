import React from 'react';

/**
 * @param {object} props Objet contenant les propriétés
 * @param {string | undefined} props.message Message unique
 * @param {array<string> | undefined} props.messages Tableau de plusieurs messages
 */
function ErrorMessage(props) {


    return (
        <>
            {props.message &&
                <p className='text-red-500'>{props.message}</p>
            }
            {
                !props.message &&
                <div className='bg-white rounded p-1'>
                    {props.messages.map((msg) => {
                        <p className='text-red-500'>{msg}</p>
                    })}
                </div>
            }
            </>
    );
}

export default ErrorMessage;
