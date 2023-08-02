"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/shadcn-ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form"
import { Input } from "@/components/shadcn-ui/input"
import { toast } from "@/components/shadcn-ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/shadcn-ui/avatar"
import { ToastAction } from "@/components/shadcn-ui/toast"
import FileUploader from "@/components/(ProfilePage)/FileUploader"

import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import useAxiosAuth from "@/library/hooks/useAxiosAuth"
import { AxiosError } from "axios"
import { useState } from "react"

import { storage } from "@/firebase/clientApp"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"

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
    let firebaseImgUrl = ''
    const [ imgUrl, setImgUrl ] = useState('');
    const [ imageToUpload, setImageToUpload ] = useState<any>(null);
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

            const checkImageSize = imageSquema.parse(image)
            setImageToUpload(image)

            const imgUrlDisplay = URL.createObjectURL(image)
            setImgUrl(imgUrlDisplay)

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
        try{
            const IMAGE_LINK = process.env.NEXT_PUBLIC_IMG_LINK
            const user_id = session?.user.id

            const imageRef = ref(storage, `${IMAGE_LINK}${user_id}`)
            const deleteFirebaseImg = deleteObject(imageRef)

            const updateSession = await update(
                {...session, 
                user: {
                    ...session?.user,
                    profile_picture_url: false
                }
            });

            const updateProfile = await axiosAuth.patch('/update-profile', {
                id: session?.user.id,
                image: false,
                username: session?.user.username
            })
            setImgUrl('')
            toast({
                description: 'Your profile has been updated',
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
            if (imageToUpload === null) {
                data.image = false
            } 

            let updatedUser = {
                ...session?.user,
                ...(data.username !== '' && { username: data.username}),
            };

            if (JSON.stringify(updatedUser) === JSON.stringify(session?.user) && typeof data.image === 'boolean') {
                toast({
                    variant: "destructive",
                    description: "You haven't made any changes.",
                });
            } else {
                if (imageToUpload !== null) {
                    try {
                        const imageRef = ref(storage, `AvatarImages/USER_ID_${session?.user.id}`)
                        const uploadToFirebase = await uploadBytes(imageRef, imageToUpload)
                        const avatarUrl = await getDownloadURL(imageRef)
                        firebaseImgUrl = avatarUrl
                    } catch (error){
                        console.log(error)
                        return
                    }

                    const updatedImage = imageToUpload !== null ? firebaseImgUrl : session?.user.profile_picture_url || false;
                    
                    const updateProfile = await axiosAuth.patch('/update-profile', {
                        id: session?.user.id,
                        image: updatedImage,
                        username: data.username
                    })

                    const updateSession = await update(
                        {...session, 
                        user: {
                            ...updatedUser,
                            profile_picture_url: updatedImage !== false ? updatedImage : undefined 
                        }
                    });
                }
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
                            {session?.user.profile_picture_url && imgUrl === '' && (
                                <Image unoptimized={true} src={session?.user.profile_picture_url} width={200} height={200} alt='avatar Image'></Image>
                            )}

                            {imgUrl !== '' &&(
                                <Image unoptimized={true} src={imgUrl} alt='' width={200} height={200}></Image>
                            )}

                            {!session?.user.profile_picture_url && imgUrl === '' && (
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
                                    <Input autoComplete="username" placeholder={session?.user.username} {...field} />
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