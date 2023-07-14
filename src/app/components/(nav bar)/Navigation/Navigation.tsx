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
import { LogOut, User, BrainCog } from "lucide-react"
import { NavSkeleton } from '../NavigationSkeleton/NavigationSkeleton';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { toast } from '../../shadcn-ui/use-toast';
import { ToastAction } from '../../shadcn-ui/toast';

export default function Navigation() {

    const router = useRouter();
    const { data: session, status, update } = useSession()
    const axiosAuth = useAxiosAuth()

    async function handleLogOut() {

        await axiosAuth.post('/logout')
        await signOut({
            redirect:true,
            callbackUrl: '/'
        })
    }

    function base64ToUint8Array(base64: any) {
        const binaryString = atob(base64);
        const length = binaryString.length;
        const uintArray = new Uint8Array(length);
      
        for (let i = 0; i < length; i++) {
          uintArray[i] = binaryString.charCodeAt(i);
        }
      
        return uintArray;
    }

    function uint8ArrayToDataURL(uint8Array: any) {
        const blob = new Blob([uint8Array]);
        const dataURL = URL.createObjectURL(blob);
        return dataURL;
    }
    
    const getProfilePict = async () => {

        try{
            const response = await axiosAuth.post('/get-image', {
                id: session?.user.id
            })
            const base64Img = response.data.image
            const uint8Array = base64ToUint8Array(base64Img);
            const dataURL = uint8ArrayToDataURL(uint8Array);
    
            await update({...session, 
                user: {
                    ...session?.user,
                    profile_picture_url: dataURL,
                    profile_picture: true
                }
            })
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data.msg === 'Token has expired') {
                    toast({
                        variant: "destructive",
                        title: 'Unable to fetch your account data',
                        description: "Your session has expired, please login again.",
                        action: <ToastAction 
                        onClick={() => signOut({
                                        redirect:true,
                                        callbackUrl: '/login'
                                    })} 
                        altText="Login"> Login </ToastAction>,
                        })
                    } else {
                        console.log(error)
                }
            }
        }
    }

    const handleImageError = async () => {
        getProfilePict()
    }

    useEffect(() => {
        if (session?.user.profile_picture === true && session.user.profile_picture_url === undefined) {
            getProfilePict()
        }
    }, [session?.user.profile_picture])

    return (
        <div>
            {status === 'loading' ? (
                <> <NavSkeleton /> </> 
            ) : (
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
                                            {session.user.profile_picture && session.user.profile_picture_url !== undefined && (
                                                <Image onError={handleImageError} src={session.user.profile_picture_url} width={40} height={40}  alt=''></Image>
                                            )}
                                            {!session?.user.profile_picture && (
                                                <AvatarFallback>{session?.user.username.charAt(0)}</AvatarFallback>
                                            )}
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
                                        <DropdownMenuItem onClick={() => router.push(`/profile/${session.user.username}/settings/profile`)} 
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
            )}
        </div>
    )
}