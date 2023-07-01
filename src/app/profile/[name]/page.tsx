'use client'
import React from "react";

interface Props {
    params: { name: string }
}

export default function Profile({ params }: Props ) {

    return (  
        <>
            <div className="Profile text-white mt-4 text-2xl">
                <h1>Welcome back {params.name}</h1>
            </div>  
        </>
    )
}