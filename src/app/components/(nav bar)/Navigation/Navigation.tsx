'use client'

import { signIn, signOut, useSession } from "next-auth/react";
import { Logo } from "../Logo/Logo";
import { useRouter } from 'next/navigation';
import useAxiosAuth from "@/library/hooks/useAxiosAuth";



export default function Navigation() {

    const router = useRouter();
    const { data: session } = useSession()
    const axiosAuth = useAxiosAuth()

    async function handleLogOut() {

        await axiosAuth.post('/logout')
        await signOut({
            redirect:true,
            callbackUrl: '/'
        })
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
                            onClick={handleLogOut}
                            className=" text-project-blue text-lg
                            m-2 p-1 mr-2 cursor-pointer hover:text-project-light-blue"
                            >
                            Logout
                            </p>
                            <p
                            onClick={() => router.push(`/profile/${session.user.username}`)} 
                            className=" text-project-blue text-lg
                            m-2 p-1 mr-2 cursor-pointer hover:text-project-light-blue">
                            {session.user.username}
                            </p>
                        </>
                    ) : (
                        <>
                            <p 
                            onClick={() => signIn()}
                            className=" text-project-blue text-lg
                            m-2 p-1 mr-2 cursor-pointer hover:text-project-light-blue"
                            >
                            Sign in
                            </p>
                            <p
                            onClick={() => router.push('/signup')}
                            className=" text-project-blue text-lg
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