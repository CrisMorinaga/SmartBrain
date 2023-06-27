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
    box: {}
}

const flaskImgDataApi = 'http://localhost:8080/api?url='

async function getDataFromApi(url:string) {
    const response = await fetch(flaskImgDataApi + url);
    const data = await response.json();
    console.log(data)
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

    onInputChange = (event: any) => {
        // console.log(event.target.value)
    }

    onSubmit = (url: string) => {
        this.setState({imageUrl: url})
        getDataFromApi(url)
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
                    <FaceRecognition imgUrl={null}/>:
                    <FaceRecognition imgUrl={this.state.imageUrl}/>}
                </div>  
            </>
        )
    }
}

export default App