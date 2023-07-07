'use client'

import { ImageLinkForm } from "../components/ImageLinkForm/ImageLinkForm";
import { Rank } from "../components/Rank/Rank";
import { FaceRecognition } from "../components/FaceRecognition/FaceRecognition";
import React from "react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "@/library/axios";
import useAxiosAuth from "@/library/hooks/useAxiosAuth";
import * as z from "zod"
import { toast } from "../components/shadcn-ui/use-toast";
import { AxiosError } from "axios";
import { ToastAction } from "../components/shadcn-ui/toast";



type Data = {
    topRow: number,
    leftCol: number,
    bottomRow: number,
    rightCol: number
};

const mySchema = z.object({
    topRow: z.number(),
    leftCol: z.number(),
    bottomRow: z.number(),
    rightCol: z.number()
})


export default function App() {

    const axiosAuth = useAxiosAuth()
    const { data: session, update, status } = useSession()

    const [imageUrl, setImageUrl] = useState('');
    const [box, setBox] = useState([]);
    const [error, setError] = useState(false);

    let errorHandler = false

    async function getDataFromApi(url:string) {
        try{
            const response = await axios({
                method: "GET",
                url: '/api',
                params: {
                    url: url
                }
              })
            const data: Data[] = response.data;
            if (data !== undefined) {
                return data
            } else {
                throw new Error('Invalid data')
            }
        }
        catch {
            setError(true)
            errorHandler = true
            setImageUrl('')
        }
    }   

    const resetUrl = () => {
        setImageUrl('')
    }

    const setErrorTrue = () => {
        setError(true)
    }

    const setErrorBackToFalse = () => {
        setError(false)
        errorHandler = false
    }

    const calculateFaceLocation = (data: any) => {

        const image = document.getElementById('inputimage') as HTMLCanvasElement;
        if (Array.isArray(data)) {
            const clarifaiFace = data.map((jsonString: any) => JSON.parse(jsonString));
            
            const positionArray = clarifaiFace.map((obj: Data) => {
                const width = image.width;
                const height = image.height;

                return {
                    leftCol: obj.leftCol * width,
                    topRow: obj.topRow * height,
                    rightCol: width - (obj.rightCol * width),
                    bottomRow: height - (obj.bottomRow * height)
                }
            });

            return positionArray as Data[]
        } else {

            const validationResult = mySchema.safeParse(data)
            if (validationResult.success) {
                const width = image.width;
                const height = image.height;

                return {
                    leftCol: data.leftCol * width,
                    topRow: data.topRow * height,
                    rightCol: width - (data.rightCol * width),
                    bottomRow: height - (data.bottomRow * height)
                }
            } else {
                toast({
                    variant: "destructive",
                    description: "Uh oh! There seems to be a problem with that image. Try with a new one.",
                    })
                setError(true)
                errorHandler = true
                setImageUrl('')
            }
        }
    }

    const displayFaceBox = (box: any) => {
        setBox(box)
    }

    const onSubmit = async (url: string) => {
        setImageUrl(url)

        // Resets box on image
        setBox([])
        try{
            const request = await getDataFromApi(url)
            if (request !== undefined) {
                const boxSizes =  calculateFaceLocation(request)
                const putBoxOnImage =  displayFaceBox(boxSizes)
            };
            if (session?.user && !errorHandler) {
                try {
                    const getRanking = await axiosAuth.patch('/add-search-to-data', {
                        id: session?.user.id,
                        url: url
                    });
                    const totalSearches = getRanking.data.total_searches
                    // TODO: Check how to update without reloading 
                    await update({...session, 
                        user: {
                            ...session?.user,
                            total_searches: totalSearches
                        }
                    });
                } catch (error) {
                    if (error instanceof AxiosError) {
                        if (error.response?.data.msg === 'Token has expired') {
                        toast({
                            variant: "destructive",
                            title: 'Unable to update your search count!',
                            description: "Your session has expired, please login again.",
                            action: <ToastAction 
                            onClick={() => signOut({
                                            redirect:true,
                                            callbackUrl: '/login'
                                        })} 
                            altText="Login"> Login </ToastAction>,
                            })
                        } else {
                            console.log(error)
                        }
                    }
                }
            }   
        } catch {
            console.log(`Couldn't proccess url image, please check if the url is correct and try again.`)
        }
        
    }

    return ( 
        <>
            <div className="App">
                {status === 'loading'

                ? <></>

                :<div className="mt-5">
                    <Rank />
                    <ImageLinkForm 
                    resetUrl={resetUrl}
                    setErrorTrue={setErrorTrue}
                    setErrorBackToFalse={setErrorBackToFalse}
                    error={error}
                    onSubmit={onSubmit}
                    />
                    <FaceRecognition error={error} box={box} imgUrl={imageUrl}/>
                </div>
                }
            </div>  
        </>
    )
}
