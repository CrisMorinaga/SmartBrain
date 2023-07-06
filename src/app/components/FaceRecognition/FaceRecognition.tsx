'use client'
import image from './noImage.png'
import errorImage from './error.png'
import Image from 'next/image'
import { useEffect } from 'react'

interface Data {
    topRow: number,
    leftCol: number,
    bottomRow: number,
    rightCol: number
}

type Props = {
    imgUrl: string,
    box: Data | any,
    error: boolean
  };

export function FaceRecognition({imgUrl, box, error}: Props) {

    return (
        <div className="center m-4">
            <div className="shadow-lg absolute">
                <div className='container flex flex-col'>
                    { imgUrl !== ""?
                        <>
                        <img 
                        id="inputimage" 
                        width='400px' 
                        height='auto' 
                        className="rounded-lg" 
                        src={imgUrl} 
                        alt="" 
                        />                
                        {Array.isArray(box) ? (
                            box.map((obj: Data, index: number) => (
                                <div
                                    key={index}
                                    className="bounding-box"
                                    style={{
                                    top: obj.topRow,
                                    right: obj.rightCol,
                                    bottom: obj.bottomRow,
                                    left: obj.leftCol
                                    }}
                                ></div>
                                ))
                            ) : (
                                <div
                                    className="bounding-box"
                                    style={{
                                    top: box.topRow,
                                    right: box.rightCol,
                                    bottom: box.bottomRow,
                                    left: box.leftCol
                                    }}
                                ></div>
                            )
                        }
                        </>
                        : !error?
                        <Image 
                        className='rounded-lg drop-shadow-xl' 
                        width={500}
                        priority={true} 
                        src={image} 
                        alt='image'
                        /> : error &&
                    <>
                        <Image 
                        className='rounded-lg drop-shadow-xl' 
                        width={500}
                        priority={true} 
                        src={errorImage} 
                        alt='image'
                        />
                        <p className=' text-white text-center mt-4 mb-4 border rounded border-dashed'> 
                            That is not a valid URL, please check it or try again with a new one.
                        </p>
                    </> 
                    }     
                </div>  
            </div>
        </div>
    )
}