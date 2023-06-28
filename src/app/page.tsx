'use client'

import { ImageLinkForm } from "./components/ImageLinkForm/ImageLinkForm";
import { Logo } from "./components/Logo/Logo";
import { Navigation } from "./components/Navigation/Navigation";
import { Rank } from "./components/Rank/Rank";
import Particle from "./components/Particle/Particle"
import { FaceRecognition } from "./components/FaceRecognition/FaceRecognition";
import React, { Component} from "react";

type MyProps = {}

type MyState = {
    input: string,
    imageUrl: string,
    box: Data | {}
}

interface Data {
    topRow: number,
    leftCol: number,
    bottomRow: number,
    rightCol: number
}

const flaskImgDataApi = 'http://localhost:8080/api?url='

async function getDataFromApi(url:string) {
    try{
        const response = await fetch(flaskImgDataApi + url);
        const data = await response.json();
        if (data) {
            return data as Data
        } else {
            throw new Error('Invalid data')
        }
    }
    catch (error) {
        console.log(error)
    }
    
}   

class App extends Component <MyProps, MyState>{
    constructor(props: MyProps) {
        super(props);
        this.state = {
            input: '',
            imageUrl: '',
            box: {}
        }
    }

    calculateFaceLocation = (data: any) => {
        const clarifaiFace = data;
        console.log(clarifaiFace)
        const image = document.getElementById('inputimage') as HTMLCanvasElement;
        const width = image.width;
        const height = image.height;
        console.log(width, height)
        return {
            leftCol: clarifaiFace.leftCol * width,
            topRow: clarifaiFace.topRow * height,
            rightCol: width - (clarifaiFace.rightCol * width),
            bottomRow: height - (clarifaiFace.bottomRow * height)
        }
    }

    displayFaceBox = (box: Data) => {
        this.setState({box: box});
    }

    onInputChange = (event: any) => {
        // console.log(event.target.value)
    }

    onSubmit = async (url: string) => {
        this.setState({imageUrl: url})
        try{
            const data = await getDataFromApi(url)
            const boxSizes = await this.calculateFaceLocation(data)
            this.displayFaceBox(boxSizes)

        } catch {
            console.log('Server error')
        }
        
        
    }

    render() {
        return (  
            <>
                <Particle />
                <div className="App">
                    <Navigation />
                    <Logo />    
                    <Rank />
                    <ImageLinkForm 
                    onInputChange={this.onInputChange}
                    onSubmit={this.onSubmit}
                     />

                    {(this.state.imageUrl.length === 0)? 
                    <FaceRecognition box={this.state.box} imgUrl={null}/>:
                    <FaceRecognition box={this.state.box} imgUrl={this.state.imageUrl}/>}
                </div>  
            </>
        )
    }
}

export default App