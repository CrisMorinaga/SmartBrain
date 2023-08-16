import { toast } from "../shadcn-ui/use-toast";
import { ToastAction } from "../shadcn-ui/toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/shadcn-ui/dialog"
import { Separator } from "../shadcn-ui/separator";
import PaginationControls from "./PaginationControl";

import useAxiosAuth from "@/library/hooks/useAxiosAuth"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { AxiosError } from "axios";
import Image from "next/image";
  
export default function Searches({searchParams}: {
    searchParams: { [key: string]: string | string[] | undefined}
}) {
    const { data: session } = useSession();
    const axiosAuth = useAxiosAuth();
    const [ data, setData ] = useState<[string, string][]>([]);
    console.log(data)

    // Setting up pagination
    const page = searchParams['page'] ?? '1'
    const per_page = 6 
    const start = (Number(page) - 1) * per_page
    const end = start + per_page

    const images = data.slice(start, end)
    //

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
                    return
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
            <div className="gallery columns-3 mb-20">
                {images.map((urlData, index) => {
                    const url = urlData[0];
                    const date = urlData[1]
                    return ( 
                        <div className="pics" key={index}>
                            <Dialog>
                            <DialogTrigger>
                                <Image 
                                unoptimized={true}
                                width={0}
                                height={0}
                                src={url} alt="" className="rounded border w-[400px] h-auto"/>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle>Search number: {(index + 1) + start}</DialogTitle>
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
            {data.length !== 0 && (
                <div className="fixed bottom-0 bg-white w-full rounded flex justify-center p-2">
                    <PaginationControls 
                    hasNextPage={end < data.length} 
                    hasPrevPage={start > 0}
                    size={data.length}
                    />
                </div>
            )}
        </>
    )
}