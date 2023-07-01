'use client'

import { ImageLinkForm } from "./components/ImageLinkForm/ImageLinkForm";
import { Rank } from "./components/Rank/Rank";
import { FaceRecognition } from "./components/FaceRecognition/FaceRecognition";
import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "@/library/axios";



type Data = {
    topRow: number,
    leftCol: number,
    bottomRow: number,
    rightCol: number
};

async function getDataFromApi(url:string) {
    try{

        const response = await axios({
            method: "GET",
            url: '/api',
            params: {
                url: url
            }
            // headers: {
            //   Authorization: 'Bearer ' + token
            // }
          })
        const data: Data[] = await response.data;
        if (data !== undefined) {
            return data
        } else {
            throw new Error('Invalid data')
        }
    }
    catch (error) {
        console.log(error)
    }
}   


export default function App() {

    const [imageUrl, setImageUrl] = useState('');
    const [box, setBox] = useState([]);
    const { data: session } = useSession()

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
        setBox([])
        try{
            const request = await getDataFromApi(url)
            if (request !== undefined) {
                const boxSizes = await calculateFaceLocation(request)
                const putBoxOnImage = await displayFaceBox(boxSizes)
            }

        } catch {
            console.log(`Couldn't proccess url image, please check if the url is correct and try again.`)
        }
        
        
    }

    return (  
        <>
            <div className="App">
                <div className="mt-5">
                    <Rank />
                    <ImageLinkForm 
                    onSubmit={onSubmit}
                    />
                    {(imageUrl.length === 0)? 
                    <FaceRecognition box={box} imgUrl={''}/>:
                    <FaceRecognition box={box} imgUrl={imageUrl}/>}
                </div>
            </div>  
        </>
    )
}
