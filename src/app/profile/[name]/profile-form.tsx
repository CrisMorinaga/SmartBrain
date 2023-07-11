"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/app/components/shadcn-ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/components/shadcn-ui/form"
  
import { Input } from "@/app/components/shadcn-ui/input"
import { toast } from "@/app/components/shadcn-ui/use-toast"
import { Avatar, AvatarFallback } from "@/app/components/shadcn-ui/avatar"
import Image from "next/image"

import { signOut, useSession } from "next-auth/react"
import useAxiosAuth from "@/library/hooks/useAxiosAuth"
import { AxiosError } from "axios"
import { ToastAction } from "@/app/components/shadcn-ui/toast"
import { useState } from "react"
import FileUploader from "@/app/components/(profile page)/FileUploader"

const maxFileSize = 1000000;

const FormSchema = z.object({

    username: z
            .string()
            .min(2, {message: 'Username must be at least 2 characters.'})
            .max(30, {message: "Username must not be longer than 30 characters."})
            .optional()
            .or(z.literal('')),

    image: z.any().optional()
})

type ProfileFormValues = z.infer<typeof FormSchema>

export function ProfileForm() {
        
    const { data: session, update } = useSession({required:true})
    const [ imgUrl, setImgUrl ] = useState('');
    const [ bytea, setBytea ] = useState<any>(undefined);
    const [ show, setShow ] = useState(false);

    const axiosAuth = useAxiosAuth();

    const form = useForm<ProfileFormValues>({
        
        resolver: zodResolver(FormSchema),
        mode:'onChange',
        defaultValues: {
            username: '',
            image: ''
        }
    })

    const convertImageToByteArray = async (imageFile: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
        
            reader.onload = (event) => {
              if (event.target && event.target.result) {
                let arrayBuffer = event.target.result;
                if (typeof arrayBuffer === 'string') {
                    arrayBuffer = Uint8Array.from(atob(arrayBuffer),
                    (c) => c.charCodeAt(0)
                    ).buffer;
                }
                const uintArray = new Uint8Array(arrayBuffer);
                const byteArray = Array.from(uintArray);
                resolve(byteArray);
              } else {
                reject(new Error('Failed to read image file'));
              }
            };
        
            reader.onerror = (event) => {
              reject(new Error('Error reading image file'));
            };
        
            reader.readAsArrayBuffer(imageFile);
          });
    }
    
    async function handleFileInputChange(e: any) {
        try {
            const image = e.target.files?.[0];

            const imageSquema = z.instanceof(File).superRefine((f, ctx) => {
                if (f.size > maxFileSize) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.too_big,
                        type: "array",
                        message: `Your image must not be larger than 1MB. Your image: ${f.size / 1000000}MB`,
                        maximum: maxFileSize,
                        inclusive: true
                    })
                }
            })

            const check = imageSquema.parse(image)

            const imageURL = URL.createObjectURL(image);
            setImgUrl(imageURL);

            const byteArray = await convertImageToByteArray(image) as Uint8Array;
            setBytea(byteArray);

        } catch (error) {
            if (error instanceof z.ZodError) {
                if (error.errors[0].code === 'too_big') {
                    toast({
                        variant: "destructive",
                        title: 'Unable to process your image',
                        description: error.errors[0].message,
                        })
                    return
                }
            }
        }
    }

    async function handleRemoveImage() {
        setImgUrl('')
        setBytea(undefined)
        try{
            const updateProfile = await axiosAuth.patch('/update-profile', {
                id: session?.user.id,
                image: null,
                username: session?.user.username
            })
            const updateSession = await update(
                {...session, 
                user: {
                    profile_picture: false
                }
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data.msg === 'Token has expired') {
                    toast({
                        variant: "destructive",
                        title: 'Unable to update your account!',
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

    function showOrHide() {
        setShow(prev => !prev)
    }

    async function onSubmit(data: ProfileFormValues) {
        try {
            if (bytea === undefined) {
                data.image = session?.user.profile_picture
            } else {
                data.image = bytea
            }
            
            let updatedUser = {
                ...session?.user,
                ...(data.username !== '' && { username: data.username}),
                ...(data.image !== false && { profile_picture: true}),
            };

            if (JSON.stringify(updatedUser) === JSON.stringify(session?.user) && typeof data.image === 'boolean') {
                toast({
                    description: "You haven't made any changes.",
                });
            } else {
                const updateProfile = await axiosAuth.patch('/update-profile', {
                    id: session?.user.id,
                    image: data.image,
                    username: data.username
                })

                const updateSession = await update(
                    {...session, 
                    user: {
                        ...updatedUser,
                        profile_picture_url: imgUrl
                    }
                });

                toast({
                    description: 'Your profile has been updated',
                });
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data.msg === 'Token has expired') {
                toast({
                    variant: "destructive",
                    title: 'Unable to update your account!',
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
            } else {
                console.log(error)
            }
        }
    }

    return (
        <Form {...form}>
            <form 
            method="POST" 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8 flex flex-col flex-shrink-0 md:flex-row items-start">
                <div className="container">
                    <p className="text-white mb-2 font-semibold">Profile picture</p>
                    <div className="flex flex-col items-center">
                        <Avatar 
                        onClick={showOrHide}
                        className="cursor-pointer"
                        style={{ height: '200px', width: '200px', fontSize: '80px'}}
                        >
                            {session?.user.profile_picture_url !== undefined && imgUrl === '' && (
                                <Image src={session.user.profile_picture_url} width={200} height={200} alt=''></Image>
                            )}

                            {imgUrl !== '' &&(
                                <Image src={imgUrl} alt='' width={200} height={200}></Image>
                            )}

                            {!session?.user.profile_picture && imgUrl === '' && (
                                <AvatarFallback>{session?.user.username.charAt(0)}</AvatarFallback>
                            )}

                        </Avatar>
                        <label 
                        onClick={showOrHide}
                        className="text-white text-center bg-project-boxes border rounded mt-2 p-1 w-60 cursor-pointer">Edit</label>
                        
                        <FileUploader 
                        show={show}
                        handleRemoveImage={handleRemoveImage}
                        handleFileInputChange={handleFileInputChange}/>
                        
                    </div>
                </div>
                <div className="space-y-8">
                    <FormField
                        control={form.control}
                        defaultValue={session?.user.username}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Username</FormLabel>
                                <FormControl>
                                    <Input placeholder={session?.user.username} {...field} />
                                </FormControl>
                                <FormMessage />
                                <FormDescription className=" text-project-text-color">
                                    This is your public display name. It can be your real name or a
                                    pseudonym.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Button className=" project-button" type="submit">Update profile</Button>
                </div>

            </form>
        </Form>
    )
}