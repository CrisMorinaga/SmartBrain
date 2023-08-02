'use client'

import { Logo } from "@/components/(NavBar)/Logo";
import { Avatar, AvatarFallback } from "@/components/shadcn-ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/shadcn-ui/dropdown-menu"

import { LogOut, BrainCog, ImageIcon, Menu, LogIn, User } from "lucide-react"
import { Session } from 'next-auth/core/types';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Image from 'next/image';


type Props = {
    handleImageError: () => void,
    handleLogOut: () => void,
    serverSession: Session | null,

}

export function BigNavBar({handleImageError, handleLogOut, serverSession}: Props) {

    const router = useRouter();
    const {data: session} = useSession()
    const sessionExist = useRef(serverSession ? true : false)

    return(
        <nav className="flex place-content-between items-center bg-white rounded">
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
                m-2 p-1 mr-2 cursor-default">
                    SmartBrain
                </p>
            </div>

        <div className="flex flex-row items-center">
            {sessionExist.current ? (
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
                            {session?.user.profile_picture_url ? (
                                <Image unoptimized={true} onError={handleImageError} src={session.user.profile_picture_url} width={40} height={40}  alt='avatar Image'></Image>
                            ) : (
                                <AvatarFallback>{session?.user.username.charAt(0)}</AvatarFallback>
                            )}
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel className=" text-project-boxes-border cursor-default">{session?.user.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator className=" bg-slate-600" />
                            <DropdownMenuItem onClick={() => router.push(`/profile/${session?.user.username}`)} 
                                            className="cursor-pointer">
                                <ImageIcon className="mr-2 h-4 w-4 cursor-pointer" />
                                <span>Gallery</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/profile/${session?.user.username}/settings/profile`)} 
                                            className="cursor-pointer">
                                <BrainCog className="mr-2 h-4 w-4 cursor-pointer"/>
                                <span>Settings</span>
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
                    onClick={() => router.push('/login')}
                    className=" text-project-blue text-lg
                    m-2 p-1 mr-2 cursor-pointer hover:text-project-light-blue"
                    >
                    Log in
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
    )
}

export function SmallScreenNavBar({handleImageError, handleLogOut, serverSession}: Props) {

    const { data: session } = useSession();
    const router = useRouter();
    const sessionExist = useRef(serverSession ? true : false)

    return(
        <nav className="flex place-content-between items-center bg-white rounded">
            <Logo router={router}/>  
            <p className=" text-project-blue text-2xl
                m-2 p-1 mr-2 cursor-default">
                    SmartBrain
            </p>
            {sessionExist.current ? (
                <div className="m-4">
                    <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            {session?.user.profile_picture_url ? (
                                <Image unoptimized={true} onError={handleImageError} src={session?.user.profile_picture_url} width={40} height={40}  alt='avatar Image'></Image>
                            ) : (
                                <AvatarFallback>{session?.user.username.charAt(0)}</AvatarFallback>
                            )}
                        </Avatar> 
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className=" text-project-boxes-border cursor-default">{session?.user.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator className=" bg-slate-600" />
                        <DropdownMenuItem onClick={() => router.push(`/profile/${session?.user.username}`)} 
                                        className="cursor-pointer">
                            <ImageIcon className="mr-2 h-4 w-4 cursor-pointer" />
                            <span>Gallery</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/profile/${session?.user.username}/settings/profile`)} 
                                        className="cursor-pointer">
                            <BrainCog className="mr-2 h-4 w-4 cursor-pointer"/>
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogOut} 
                                        className="cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            ) : (
                <DropdownMenu>
                <DropdownMenuTrigger>
                    <Menu className='m-4'/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => router.push('/login')} className="cursor-pointer">   
                        <LogIn className="mr-2 h-4 w-4 cursor-pointer"/>
                        <p>Log in</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/signup')} className="cursor-pointer">   
                        <User className="mr-2 h-4 w-4 cursor-pointer"/>
                        <p> Register</p>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            )}
        </nav>
    )
}