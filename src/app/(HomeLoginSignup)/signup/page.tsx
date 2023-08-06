'use client'

import ProgressBar from "@/components/ProgressBar";
import { Signup } from "@/components/Signup/Signup";

import { useSession } from "next-auth/react";


export default function LogIn() {

    const { data: session } = useSession();

    return (  
        <>{session?.user 
        ?<ProgressBar />
        :<div className="Signin">
            <Signup />
        </div>  
        }
        </>
    )
}