'use client'

import { useSession } from "next-auth/react"


export function Rank () {

    const { data: session } = useSession()

    return (
        <>
            {session? (
                <div className="flex flex-col items-center mb-3">
                <div className="text-project-text-color text-xl">
                    {"Your current rank is..."}
                </div>
                <div className="text-project-text-color text-3xl">
                    {"#5"}
                </div>
            </div>
            ) : (
                <></>
            )}
        </>
    )
}