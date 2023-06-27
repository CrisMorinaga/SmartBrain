'use client'

import { useState } from "react"

type Props = {
    handleUrlChange: (url: string) => void
}


export function ImageLinkForm ({handleUrlChange}: Props) {

    const [name, setName] = useState('')
    const placeHolder = 'Enter an image url'

    return (
        <>
            <div>
                <p className="text-lg text-project-light-blue text-center">
                    {'This Magic Brain will detect faces in your pictures. Give it a try.'}
                </p>
                <div className="center">
                    <div className="border border-project-text-color mt-3 rounded shadow-lg">
                        <input 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        placeholder={placeHolder}
                        className="w-72 ml-3 rounded" 
                        type="text" 
                        />
                        
                        <button
                        onClick={() => handleUrlChange(name)}
                        className="project-button text-base grow
                        my-3 mx-3 p-2">
                        Detect
                        </button>

                        {
                            name.length > 2 ? <p 
                            className=" text-project-text-color text-center">
                                Your image is being loaded
                                </p> : <></>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}