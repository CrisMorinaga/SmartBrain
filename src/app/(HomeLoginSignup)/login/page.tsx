'use client'
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/shadcn-ui/use-toast"
import { ToastAction } from "@/app/components/shadcn-ui/toast";
import { Signin } from "@/app/components/Signin/Signin";


export default function LogIn() {

    const { data: session, status } = useSession()
        
    const router = useRouter();
    const { toast } = useToast()
    const [ error, setError] = useState(200)

    useEffect(() => {
        if (session) {
            router.push(`/profile/${session.user.username}`)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

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
        ? <></>
        :<div className="Signin">
            <Signin catchError={catchError}/>
        </div>  
        }
        </>
    )
}