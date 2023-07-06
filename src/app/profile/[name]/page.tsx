'use client'
import useAxiosAuth from "@/library/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
    params: { name: string }
}

interface Obj {
    urls: [],
    searches: number | null
}

export default function Profile({ params }: Props ) {

    const [search, setSearch] = useState<Obj>({urls: [], searches: null})
    const { data: session } = useSession()
    const axiosAuth = useAxiosAuth()
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push(`/profile/${session.user.username}`)
        }
    }, [session, router])

    async function fetchSearches() {
        const response = await axiosAuth.post('/profile', {
            id: session?.user.id
        })
        setSearch(response.data)
    }

    return (  
        <>
            <div className="container">
                <div className="Profile text-white mt-4 text-2xl">
                    <h1>Welcome back {params.name}</h1>
                </div>  
                <button onClick={fetchSearches} className="project-button mt-4 p-2"> Check my searches </button>
                {search.searches && 
                    <div className="text-white mt-2"> You have made: {search.searches} searches. </div>
                }
                {search.urls.length > 0 && 
                    search.urls.map((url: string, i) => (
                        <div key={i} className="text-white mt-2">
                            <ul>
                                <li >{url}</li>
                            </ul>
                        </div>
                    ))
                }
            </div>
        </>
    )
}