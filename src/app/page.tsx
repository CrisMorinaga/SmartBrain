import { ImageLinkForm } from "./components/ImageLinkForm/ImageLinkForm";
import { Logo } from "./components/Logo/Logo";
import { Navigation } from "./components/Navigation/Navigation";
import { Rank } from "./components/Rank/Rank";
import Particle from "./components/Particle/Particle"
import { FaceRecognition } from "./components/FaceRecognition/FaceRecognition";

export default function App() {
    let url = ''

    async function handleUrlChange(newUrl: string) {
        'use server'
        let url = newUrl
        console.log(url)
        return url
    }
    // console.log(url)

    return (  
        <>
            <Particle />
            <div className="App">
                <Navigation />
                <Logo />    
                <Rank />
                <ImageLinkForm handleUrlChange={handleUrlChange}/>
                <FaceRecognition url={url}/>
            </div>
        </>
    )
    }