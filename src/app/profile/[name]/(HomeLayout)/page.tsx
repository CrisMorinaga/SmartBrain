'use client'

import Searches from "@/app/components/(profile page)/Searches"
import { useSession } from "next-auth/react"


export default function ProfilePage() {

    const { data: session } = useSession()

    return (
        <>
        <div className="bg-project-boxes p-2">
            <h1 className="text-white text-xl text-start cursor-default">
                Welcome back {session?.user.username} / This is your gallery
            </h1>
        </div>
            <Searches />
        </>

    )
}