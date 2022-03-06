import React from 'react';

/**
 * @param {object} props Objet contenant les propriétés
 * @param {string | undefined} props.message Message unique
 * @param {array<string> | undefined} props.messages Tableau de plusieurs messages
 */
function ErrorMessage(props) {
    console.log("errgot",props)

    return (
        <>
            {props.message &&
                <p className='text-red-500'>{props.message}</p>
            }
            {
                !props.message &&
                <div className='flex flex-col my-3 bg-white w-[20rem] rounded p-1'>
                    {props.messages.map((msg) => {
                        return <p className='text-red-500'>{msg}</p>
                    })}
                </div>
            }
            </>
    );
}

export default ErrorMessage;
