'use client'

import noImage from '@/FaceRecognitionComponent/noImage.webp'
import errorImage from '@/FaceRecognitionComponent/error.webp'
import timeoutImage from '@/FaceRecognitionComponent/timeout.svg'

import { ImageSkeleton } from '@/components/Skeletons'
import { MutableRefObject } from 'react'
import Image from 'next/image'


interface Data {
    topRow: number,
    leftCol: number,
    bottomRow: number,
    rightCol: number
}

type Props = {
    box: Data | any,
    error: boolean,
    imageUrl : MutableRefObject<string>
  };

export function FaceRecognition({box, error, imageUrl}: Props) {

    const imgUrl = imageUrl.current
    
    const imageExist = imgUrl !== "" && imgUrl !== "timeout"
    const timeOut = imgUrl === 'timeout'

    return (    
        <div className="center m-4 relative">
            <div className="shadow-lg relative">
                <div className='flex flex-col'>
                    { imageExist ?
                        <>
                        <Image
                        unoptimized={true}
                        id="inputimage" 
                        width={0}
                        height={0}
                        className="rounded-lg w-[400px] h-auto relative" 
                        src={imgUrl} 
                        alt="" 
                        /> 
                        {box.length === 0 && (
                            <div className="absolute top-0 left-0 w-full h-full">
                                <ImageSkeleton />
                            </div>
                        )}               
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
                        src={noImage} 
                        alt='image'
                        /> : error && timeOut ? (
                            <>
                                <Image 
                                className='rounded-lg drop-shadow-xl bg-white p-4 self-center' 
                                width={400}
                                priority={true} 
                                src={timeoutImage} 
                                alt='image'
                                />
                                <p className=' text-white text-center mt-4 mb-4 border rounded border-dashed'> 
                                    Our servers are taking longer than usual. Please refresh and try again.
                                </p>
                            </> 
                        ) : error && !timeOut && (
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
                        )
                    }     
                </div>  
            </div>
        </div>
    )
}