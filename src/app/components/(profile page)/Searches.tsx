/* eslint-disable @next/next/no-img-element */
import useAxiosAuth from "@/library/hooks/useAxiosAuth"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { AxiosError } from "axios";
import { toast } from "../shadcn-ui/use-toast";
import { ToastAction } from "../shadcn-ui/toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/app/components/shadcn-ui/dialog"
import { Separator } from "../shadcn-ui/separator";
  


export default function Searches() {

    const { data: session } = useSession();
    const axiosAuth = useAxiosAuth();
    const [ data, setData ] = useState<[string, string][]>([]);

    const urlsFetching = async () => {

        try {
            const getUrlSearches = await axiosAuth.post('/profile', {
                id: session?.user.id
            }) 

            const responseData = getUrlSearches.data;
            const array: [string, string][] = Object.entries(responseData);
            const sortedArray = array.sort((a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime());

            setData(sortedArray)

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
                        return
                } else {
                    console.log(error)
                }
            }
        }
    }

    useEffect(() => {
        if (session?.user.access_token !== undefined) {
            urlsFetching()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user.access_token])

    return (
        <>
            <Separator className="mb-4"/>
            <div className="gallery">
                {data.map((urlData, index) => {
                    const url = urlData[0];
                    const date = urlData[1]
                    return ( 
                        <div className="pics" key={index}>
                            <Dialog>
                            <DialogTrigger>
                                <img src={url} alt="" className="w-[100%] rounded border"/>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle>Number: {index + 1}</DialogTitle>
                                <DialogDescription className="break-all">
                                    <ul className="py-4">
                                        <li className="mb-4"><strong>Date:</strong> {date}</li>
                                        <li><strong>URL: </strong>{url}</li>
                                    </ul>
                                </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                            </Dialog>
                        </div>
                    )
                })}
            </div>
        </>
    )
}