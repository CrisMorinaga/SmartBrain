'use client'

import Image from 'next/image';
import { signIn, signOut, useSession } from "next-auth/react";
import { Logo } from "../Logo/Logo";
import { useRouter } from 'next/navigation';
import useAxiosAuth from "@/library/hooks/useAxiosAuth";
import { Avatar, AvatarFallback } from "@/app/components/shadcn-ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/app/components/shadcn-ui/dropdown-menu"
  import { LogOut, User } from "lucide-react"
import { NavSkeleton } from '../NavigationSkeleton/NavigationSkeleton';

export default function Navigation() {

    const router = useRouter();
    const { data: session, status } = useSession()
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
            {status === 'loading'
            ? <> <NavSkeleton /> </> 
            : <nav className="flex place-content-between items-center bg-white rounded">
                <div className="flex flex-row items-center">
                <Logo router={router}/>  
                <p 
                className=" text-project-blue text-lg
                m-2 p-1 cursor-pointer hover:text-project-light-blue"
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
                <div className="flex flex-row items-center">
                    {session?.user ? (
                        <>
                            <p 
                            onClick={handleLogOut}
                            className=" text-project-blue text-lg
                            m-2 p-1 mr-2 cursor-pointer hover:text-project-light-blue"
                            >
                            Logout
                            </p>
                            <div className="m-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        {session.user.profile_picture && (
                                            <Image src={session.user.profile_picture} alt=''></Image>
                                        )}
                                        <AvatarFallback>{session.user.username.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel className=" text-project-boxes-border cursor-default">{session.user.email}</DropdownMenuLabel>
                                    <DropdownMenuSeparator className=" bg-slate-600" />
                                    <DropdownMenuItem onClick={() => router.push(`/profile/${session.user.username}`)} 
                                                    className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4 cursor-pointer" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogOut} 
                                                    className="cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </div>
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
            }
            
        </div>
    )
}