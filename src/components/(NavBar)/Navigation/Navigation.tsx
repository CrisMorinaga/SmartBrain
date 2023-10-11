'use client'

import { SmallScreenNavBar, BigNavBar } from "./BigSmallNavBar";

import { signOut, useSession } from "next-auth/react";
import useAxiosAuth from "@/library/hooks/useAxiosAuth";
import { useEffect, useState } from 'react';
import { Session } from "next-auth/core/types";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/clientApp"


type Props = {
    serverSession: Session | null,
}

export default function Navigation({serverSession}: Props) {

    const { data: session, update } = useSession();
    const axiosAuth = useAxiosAuth();
    const [ smallScreen, setSmallScreen ] = useState(false);
    const avatarRef = ref(storage, `AvatarImages/USER_ID_${session?.user.id}`);

    useEffect(() => {
        const handleResize = () => {
            setSmallScreen(window.innerWidth < 768);
        };

        // Initial check on component mount
        handleResize();

        window.addEventListener('resize', handleResize)

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, []);

    async function handleLogOut() {

        await axiosAuth.post('/logout')
        signOut({
            redirect:true,
            callbackUrl: '/'
        })
    }
    
    const handleImageError = async () => {

        async function getAvatarUrl() {
            if (!session?.user.profile_picture_url) {
                try {
                    const avatarUrl = await getDownloadURL(avatarRef)
                    update({...session, 
                        user: {
                            ...session?.user,
                            profile_picture_url: avatarUrl,
                        }
                    }) 
                } catch (error) {
                    console.log(error)
                    return
                }
            } else {
                return
            }    
        }
    } 

    return (
        <>
            <div>
                {smallScreen ? (
                    <SmallScreenNavBar serverSession={serverSession} handleImageError={handleImageError} handleLogOut={handleLogOut}/>
                ) : (
                    <BigNavBar serverSession={serverSession} handleImageError={handleImageError} handleLogOut={handleLogOut}/>
                )}
            </div>
        </>
    )
}