'use client'

import React from "react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/app/components/shadcn-ui/alert-dialog"
  
type Props = {
    handleFileInputChange: (e: any) => void,
    handleRemoveImage: () => void,
    show: boolean
}

export default function FileUploader({ handleFileInputChange, handleRemoveImage, show }: Props) {

    return (
        <div className="">
            <div className={`transition ease-in-out opacity-${show? '1' : '0'}
            bg-project-boxes m-2 w-60 border rounded p-2 shadow-black shadow-lg ${show ? '' : 'pointer-events-none' }`}>
                <div className="flex flex-col items-start text-sm">
                    <label 
                    htmlFor="image-input"
                    className="text-white cursor-pointer hover:bg-slate-300 hover:text-project-boxes w-full rounded p-1"
                    > Upload a photo...
                    </label>

                    <AlertDialog >
                    <AlertDialogTrigger className="pt-2 text-white text-start cursor-pointer hover:bg-slate-300 hover:text-project-boxes w-full rounded p-1">Remove photo</AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. You will have to select a new image from your computer.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveImage}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>

                    <input className='hidden' 
                    onChange={ handleFileInputChange } 
                    id="image-input"
                    type="file" 
                    name="image" 
                    accept='image/jpeg, image/jpg, image/png, image/webp'/>
                </div>
            </div>
        </div>
    )
}