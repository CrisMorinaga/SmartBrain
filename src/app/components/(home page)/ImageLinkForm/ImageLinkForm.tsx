'use client'

import { useEffect, useRef, useState } from "react"
import * as z from "zod"


type Props = {
    onSubmit: (url: string) => void,
    setErrorBackToFalse: () => void,
    setErrorTrue: () => void,
    resetUrl: () => void,
    error: boolean
}

const mySchema = z.string().url()

export function ImageLinkForm ({onSubmit, setErrorBackToFalse, setErrorTrue, resetUrl, error}: Props) {

    const [name, setName] = useState('');
    const prevNameRef = useRef('');

    useEffect(() => {
        if (error) {
            prevNameRef.current = name;
            resetUrl()
        }
    }, [error])

    useEffect(() => {
        if (prevNameRef.current !== name && error) {
            setErrorBackToFalse();
        };
    }, [name, error])

    const handleNameChange = (name: string) => {
        const validationResult = mySchema.safeParse(name);

        if (validationResult.success) {
            onSubmit(name)
        } else {
            // Not a valid url
            setErrorTrue()
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleNameChange(name)
        }
    }

    return (
        <>
            <div>
                <p className="text-lg text-project-light-blue text-center cursor-default">
                    This Magic Brain will detect faces in your pictures. Give it a try.
                </p>
                <div className="container center">
                    <div className="border border-project-text-color mt-3 rounded shadow-lg">
                        <input 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter an image url"
                            onKeyDown={handleKeyPress}
                            style={{ paddingLeft: '0.75rem'}}
                            className=" w-80 ml-3 rounded" 
                            type="text" 
                        />
                        <button
                        onClick={() => handleNameChange(name)}
                        className="project-button text-base grow
                        my-3 mx-3 p-2">
                        Detect
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}