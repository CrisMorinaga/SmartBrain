'use client'

interface Data {
    topRow: number,
    leftCol: number,
    bottomRow: number,
    rightCol: number
}

type Props = {
    imgUrl: string | null,
    box: Data | any
  };

export function FaceRecognition({imgUrl, box}: Props) {
    return (
        <div className="center m-4">
            <div className="shadow-lg absolute">
                <img id="inputimage" width='400px' height='auto' className="rounded-lg" src={imgUrl} alt="" />
                <div 
                className="bounding-box" 
                style={
                    {
                        top: box.topRow, 
                        right: box.rightCol, 
                        bottom: box.bottomRow, 
                        left: box.leftCol
                        }
                    }>
                </div>
            </div>
        </div>
    )
}