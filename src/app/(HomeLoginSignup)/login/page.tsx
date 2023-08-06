'use client'

import { Signin } from "@/components/Signin/Signin";
import ProgressBar from "@/components/ProgressBar";

import React from "react";
import { useSession } from "next-auth/react";


export default function LogIn() {

    const { data: session } = useSession()
        
    return (  
        <>{session?.user
        ? <ProgressBar />
        :<div className="Signin">
            <Signin />
        </div>  
        }
        </>
    )
}