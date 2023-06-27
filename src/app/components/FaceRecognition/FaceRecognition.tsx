'use client'

type Props = {
    url: string;
  };

export function FaceRecognition({url}: Props) {
    return (
        <div className="center">
            <img width={'250px'} className="" src={url} alt="" />
        </div>
    )
}