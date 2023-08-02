'use client'

import { useToast } from "@/components/shadcn-ui/use-toast"
import { ToastAction } from "@/components/shadcn-ui/toast";
import { Signin } from "@/components/Signin/Signin";
import ProgressBar from "@/components/ProgressBar";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";




export default function LogIn() {

    const { data: session } = useSession()
        
    const router = useRouter();
    const { toast } = useToast();
    const [ error, setError] = useState(200);

    const catchError = (userDoesntExist: boolean) => {
        if (userDoesntExist) {
            setError(404)
        } else {
            setError(401)
        }
    }

    useEffect(() => {
        if (error === 404) {
            toast({
                variant: "destructive",
                description: "That username / email doesn't exist, maybe you meant register?",
                action: <ToastAction 
                    onClick={() => router.push('/signup')} 
                    altText="Login"> Register </ToastAction>,
            })
        } else if (error === 401) {
            toast({
                variant: "destructive",
                description: "Incorrect username or password.",
                })
        } setError(200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    return (  
        <>{session?.user
        ? <ProgressBar />
        :<div className="Signin">
            <Signin catchError={catchError}/>
        </div>  
        }
        </>
    )
}