'use client'
import React, { useEffect, useState } from "react";
import { Signup } from "../../components/Signup/Signup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "../../components/shadcn-ui/use-toast";

export default function LogIn() {

    const { data: session, status } = useSession();
    const router = useRouter();
    const [error, setError] = useState(false)

    const catchError = () => {
        setError(true)
    }

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                description: "That username already exists in our database. Try with another one.",
                })
        } setError(false);
    }, [error])

    useEffect(() => {
        if (session) {
            router.push(`/profile/${session.user.username}`)
        }
    }, [session, router])

    return (  
        <>{status === 'loading'
        ?<></>
        :<div className="Signin">
            <Signup catchError={catchError}/>
        </div>  
        }
        </>
    )
}