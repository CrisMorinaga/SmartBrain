'use client'

import { useEffect, useRef, useState } from "react"
import * as z from "zod"
import { HelpCircle } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn-ui/dialog"

import Image from "next/image"
  

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    useEffect(() => {
        if (prevNameRef.current !== name && error) {
            setErrorBackToFalse();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <div className="container center sm:grid-cols-2">
                    <div className="border border-project-text-color mt-3 rounded shadow-lg flex items-center">
                        <input 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter an image url"
                            onKeyDown={handleKeyPress}
                            style={{ paddingLeft: '0.75rem'}}
                            className="sm:w-80 w-44 h-10 ml-3 rounded" 
                            type="text" 
                        />
                        <div className="flex items-center pr-2">
                            <button 
                            onClick={() => handleNameChange(name)}
                            className="project-button text-base grow
                            m-3 p-2">
                            Detect
                            </button>
                            <Dialog>
                                <DialogTrigger>
                                    <HelpCircle className="fill-white hover:cursor-pointer"/>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>How to use</DialogTitle>
                                        <DialogDescription>
                                            Choose an image from Google and copy the image address. Then just paste it on the detect box.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Image
                                    unoptimized={true}
                                    width={0}
                                    height={0}
                                    alt="how to use gif"
                                    className=" w-[700px] h-auto"
                                    src={"https://firebasestorage.googleapis.com/v0/b/smartbrain-30529.appspot.com/o/How%20to%20use%20Gif%2FHow%20to%20use.gif?alt=media&token=2402be17-51a1-48ec-8781-45bfd0d8e725"}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}