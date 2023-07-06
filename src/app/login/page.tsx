'use client'
import React, { useEffect, useState } from "react";
import { Signin } from "@/app/components/Signin/Signin";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/shadcn-ui/use-toast"

export default function logIn() {

    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast()
    const [ error, setError] = useState(false)
    
    useEffect(() => {
        if (session) {
            router.push(`/profile/${session.user.username}`)
        }
    }, [session, router])

    const catchError = () => {
        setError(true)
    }

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                description: "Incorrect username or password.",
                })
        } setError(false);
    }, [error])

    return (  
        <>{status === 'loading'
        ? <></>
        :<div className="Signin">
            <Signin catchError={catchError}/>
        </div>  
        }
        </>
    )
}