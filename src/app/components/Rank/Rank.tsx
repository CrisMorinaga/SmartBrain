'use client'

import { useSession } from "next-auth/react"

export function Rank () {

    const { data: session } = useSession()
    const search = session?.user.total_searches ?? 0

    return (
        <>
            {session? (
            <div className="flex flex-col items-center mb-3">
                <div className="text-project-text-color mt-1 p-1 border border-dashed rounded"
                >
                    {`You have made ${search} ${(search === 1)? 'search': 'searches'}`}.
                </div>
            </div>
            ) : (
                <></>
            )}
        </>
    )
}