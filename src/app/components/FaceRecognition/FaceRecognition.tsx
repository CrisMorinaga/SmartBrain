'use client'

type Props = {
    imgUrl: string | null
  };

export function FaceRecognition({imgUrl}: Props) {
    return (
        <div className="center m-4">
            <div className="shadow-lg">
                <img width={'300px'} height={'auto'} className="rounded-lg" src={imgUrl} alt="" />
            </div>
        </div>
    )
}