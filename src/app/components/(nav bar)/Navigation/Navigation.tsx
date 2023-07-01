'use client'

import { signIn, signOut, useSession } from "next-auth/react";
import { Logo } from "../Logo/Logo";
import { useRouter } from 'next/navigation';
import axios from "@/library/axios";

export default function Navigation() {

    const router = useRouter();
    const {data: session} = useSession()

    async function handleLogOut() {

        await axios({
            method: "POST",
            url: '/logout',
        })
        await signOut()
    }

    return (
        <div>
            <nav className="flex place-content-between items-center bg-white rounded">
                <div className="flex flex-row items-center">
                <Logo router={router}/>  
                <p 
                className=" text-project-blue text-lg
                m-2 p-1 mr-2 cursor-pointer hover:text-project-light-blue"
                onClick={() => router.push('/')}
                >
                Home
                </p>
                </div>

                <div className="">
                    <p className=" text-project-blue text-2xl
                    m-2 p-1 mr-2">
                        SmartBrain
                    </p>
                </div>
                <div className="flex flex-row">
                    {session?.user ? (
                        <>
                            <p 
                            className=" text-project-blue text-lg
                            m-2 p-1 mr-2 cursor-pointer hover:text-project-light-blue"
                            onClick={handleLogOut}
                            >
                            Logout
                            </p>
                            <p className=" text-project-blue text-lg
                            m-2 p-1 mr-2 cursor-pointer hover:text-project-light-blue">
                            {session.user.name}
                            </p>
                        </>
                    ) : (
                        <>
                            <p 
                            className=" text-project-blue text-lg
                            m-2 p-1 mr-2 cursor-pointer hover:text-project-light-blue"
                            onClick={() => signIn()}
                            >
                            Sign in
                            </p>
                            <p className=" text-project-blue text-lg
                            m-2 p-1 mr-2 cursor-pointer hover:text-project-light-blue">
                            Register
                            </p>
                        </>
                    )}
                </div>
            </nav>
        </div>
    )
}