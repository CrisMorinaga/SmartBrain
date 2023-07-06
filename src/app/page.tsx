'use client'

import { ImageLinkForm } from "./components/ImageLinkForm/ImageLinkForm";
import { Rank } from "./components/Rank/Rank";
import { FaceRecognition } from "./components/FaceRecognition/FaceRecognition";
import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "@/library/axios";
import useAxiosAuth from "@/library/hooks/useAxiosAuth";


type Data = {
    topRow: number,
    leftCol: number,
    bottomRow: number,
    rightCol: number
};

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
        // TODO: Set error catching for missing side on box
        if (Array.isArray(data)) {
            const clarifaiFace = data.map((jsonString: any) => JSON.parse(jsonString));
            
            console.log('clariface: ', clarifaiFace)
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
            const width = image.width;
            const height = image.height;

            return {
                leftCol: data.leftCol * width,
                topRow: data.topRow * height,
                rightCol: width - (data.rightCol * width),
                bottomRow: height - (data.bottomRow * height)
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
                const getRanking = await axiosAuth.post('/add-search-to-data', {
                    id: session?.user.id,
                    url: url
                });
                const totalSearches = getRanking.data.total_searches
                await update({...session, 
                    user: {
                        ...session?.user,
                        total_searches: totalSearches
                    }
                });
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
