"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"

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
import { Button } from "@/components/shadcn-ui/button"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import HideShowPassword from "../HideShowPassword"
import { PageLoading } from "../Skeletons"
import { useToast } from "../shadcn-ui/use-toast"
import { ToastAction } from "../shadcn-ui/toast"

 
const formSchema = z.object({
    username: z.string().min(1, {message: 'Please write your username.'}),
    password: z.string().min(1, {message: 'Please write your password.'}),
})


export function Signin() {

    const { toast } = useToast();

    const [ showPassword, setShowPassword ] = useState(false);
    const router = useRouter();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    const [ loading, setLoading ] = useState(false);
    const handleLoading = async () => {
        setLoading((prevLoading) => !prevLoading)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            const loadingStarts = await handleLoading()

            const result = await signIn("credentials", {
                username: values.username,
                password: values.password, 
                redirect:false,
            });

            if (result?.error?.includes('404')){
                throw new Error('Error 404')
            } else if (result?.error?.includes('401')){
                throw new Error('Error 401')
            }

            router.push(`/profile/${values.username}`)
            const loadingFinishes = await handleLoading()

        } catch (error: any) {
            const loadingFinishes = await handleLoading()
            
            if (error.message.includes('404')) {
                toast({
                    variant: "destructive",
                    description: "That username / email doesn't exist, maybe you meant register?",
                    action: <ToastAction 
                        onClick={() => router.push('/signup')} 
                        altText="Login"> Register </ToastAction>,
                })
            } else if (error.message.includes('401')) {
                toast({
                    variant: "destructive",
                    description: "Incorrect username or password.",
                })
            }
        }  
    }    

    return (
        <div className="container mt-20">
            <div className="center">
                <div className="w-[400px] border rounded-xl m-4 bg-project-boxes">
                    <Form {...form}>
                        <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-4">

                            {/* Username / Email */}
                            <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className=" text-white">Username / Email</FormLabel>
                                <FormControl>
                                    <Input  autoComplete='username' placeholder="username / email@..." {...field} />
                                </FormControl>
                                <FormDescription className=" text-project-text-color">
                                    Type your username or email.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            {/* Password */}
                            <div className="flex flex-row gap-2 place-items-end">
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className=" text-white">Password</FormLabel>
                                    <FormControl>
                                        <Input className="sm:min-w-[330px] min-w-[200px]" type={showPassword ? 'text' : 'password'}  autoComplete='current-password' placeholder={showPassword ? '12345678' : '********'} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <div>
                                    <HideShowPassword togglePasswordVisibility={togglePasswordVisibility} showPassword={showPassword}/>
                                </div>
                            </div>

                            <div className="flex flex-row gap-2">
                                <Button type="submit">Login</Button>
                                {loading && (
                                    <PageLoading />
                                )}
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
      )
  }

