'use client'

import Searches from "@/components/(ProfilePage)/Gallery"
import { useSession } from "next-auth/react"

export default function ProfilePage({searchParams} : {
    searchParams: { [key: string]: string | string[] | undefined},
}) {

    const { data: session } = useSession()

    return (
        <>
        <div className="bg-project-boxes p-2">
            <h1 className="text-white text-xl text-start cursor-default">
                {session?.user.total_searches !== 0 ? (
                    `Welcome back ${session?.user.username} / This is your gallery`
                    ) : (
                        `Your gallery is empty. Make your first search to start filling it!`
                    )}
            </h1>
        </div>
            <Searches searchParams={searchParams}/>
        </>

    )
}