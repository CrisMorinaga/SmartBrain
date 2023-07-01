'use client'
import image from './noImage.png'
import Image from 'next/image'

interface Data {
    topRow: number,
    leftCol: number,
    bottomRow: number,
    rightCol: number
}

type Props = {
    imgUrl: string,
    box: Data | any
  };

export function FaceRecognition({imgUrl, box}: Props) {
    return (
        <div className="center m-4">
            <div className="shadow-lg absolute">
                {(imgUrl === '')
                ? <Image 
                className='rounded-lg drop-shadow-xl' 
                width={400}
                priority={true} 
                src={image} 
                alt='image'/>
                : <img id="inputimage" width='400px' height='auto' className="rounded-lg" src={imgUrl} alt="" />                
                }

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
            </div>
        </div>
    )
}