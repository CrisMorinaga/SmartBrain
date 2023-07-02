'use client'
import React, { useEffect } from "react";
import { Signup } from "../components/Signup/Signup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function logIn() {

    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push(`/profile/${session.user.username}`)
        }
    }, [session, router])

    return (  
        <>
            <div className="Signin">
                <Signup />
            </div>  
        </>
    )
}