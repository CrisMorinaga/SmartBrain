'use client'

import { toast } from "@/components/shadcn-ui/use-toast";
import ProgressBar from "@/components/ProgressBar";
import { Signup } from "@/components/Signup/Signup";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";



export default function LogIn() {

    const { data: session, status } = useSession();
    const [error, setError] = useState(false)

    const catchError = () => {
        setError(true)
    }

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                description: "That username is already taken. Try with another one.",
                })
        } setError(false);
    }, [error])

    return (  
        <>{session?.user 
        ?<ProgressBar />
        :<div className="Signin">
            <Signup catchError={catchError}/>
        </div>  
        }
        </>
    )
}