"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"

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
import { useRouter } from "next/navigation"
import axios from "@/library/axios"
import HideShowPassword from "../HideShowPassword"
import { PageLoading } from "../Skeletons"
import { toast } from "../shadcn-ui/use-toast"
import { AxiosError } from "axios"

 
const formSchema = z.object({

    firstName: z
        .string()
        .max(30, {message: `Please don't go over 30 characters`}),
    lastName: z
        .string()
        .max(30, {message: `Please don't go over 30 characters`}),
    email: z
        .string()
        .email(),
    username: z
        .string()
        .min(2,{message: 'Username must be between 2 and 20 characters long.'})
        .max(20, {message: 'Username must be between 2 and 20 characters long.'}),
    password: z
        .string(),
    confirmPassword: z.string(),
})

export function Signup() {

    const [ showPassword, setShowPassword ] = useState(false);
    const [ wrongPasswordLength, setWrongPasswordLength ] = useState(false);
    const [ passwordsDontMatch, setPasswordsDontMatch ] = useState(false);
    const router = useRouter();

    let password = useRef('')
    let confirmPassword = useRef('')

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const [ loading, setLoading ] = useState(false);
    const handleLoading = async () => {
        setLoading((prevLoading) => !prevLoading)
    }

    function handleChange(event: any) {

        const eventName = event.nativeEvent.srcElement.name

        // Getting the variable input
        if (eventName === 'password') {
            password.current = event.target.value
        }   

        if (eventName === 'confirmPassword') {
            confirmPassword.current = event.target.value
        }
        // --------------------------------------------- //

        try {
            const passwordsComparison = z.object({
                confirmPassword: z.string(),
                password: z.string()
            }).superRefine(({confirmPassword, password}, ctx) => {
                if ((confirmPassword !== password) || (password !== confirmPassword)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "The passwords don't match.",
                    })
                } else {
                    setPasswordsDontMatch(false)

                } if (password.length < 8) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.too_small,
                        type: 'string',
                        minimum: 8,
                        inclusive: true,
                    })
                } else {
                    setWrongPasswordLength(false)
                }
            })

            const passwordsAreEqualCheck = passwordsComparison.parse({
                confirmPassword: confirmPassword.current,
                password: password.current
            })

        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.map((error) => {
                    if (error.code === 'too_small') {
                        setWrongPasswordLength(true)
                    } if (error.code === 'custom') {
                        setPasswordsDontMatch(true)
                    } 
                })
            }
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    })
   
    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            if (wrongPasswordLength || passwordsDontMatch) {
                // Avoid sending the form.
                return
            } else {
                const loadingStarts = await handleLoading()

                const register = await axios.post('/register', {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    username: values.username,
                    email: values.email,
                    password: values.password
                    
                })
    
                const result = await signIn("credentials", {
                    username: values.username,
                    password: values.password,
                    redirect:false,
                })

                if (!result?.error) {
                    router.push(`/profile/${values.username}`)
                    const loadingFinishes = await handleLoading()
                }

            } 
        } catch (error) {
            const loadingFinishes = await handleLoading()

            if(error instanceof AxiosError) {
                if (error.response?.data.message.includes('email')){
                    toast({
                        variant: "destructive",
                        description: "That email is already taken. Try with another one.",
                    })
                    return
                } else if (error.response?.data.message.includes('user')){
                    toast({
                        variant: "destructive",
                        description: "That username is already taken. Try with another one.",
                    })
                    return
                }
            }
        }
    }

    return (
        <div className="sm:container flex justify-center my-10">
            <div className="sm:center w-[360px] ">
                <div className="sm:w-[400px] border rounded-xl bg-project-boxes">
                    <Form {...form}>
                        <form 
                        method="POST" 
                        onChange={(e)=>handleChange(e)}
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="space-y-8 m-4">

                            <div className="sm:flex gap-3">
                                <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className=" text-white">First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <div className="sm:mt-0 mt-8">
                                    <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel className=" text-white">Last name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your last name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}/>
                                </div>
                            </div>
                            
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className=" text-white">Email</FormLabel>
                                <FormControl>
                                    <Input autoComplete="username" placeholder="email@mail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className=" text-white">Username</FormLabel>
                                <FormControl>
                                    <Input autoComplete="username" placeholder="Something cool" {...field} />
                                </FormControl>
                                <FormDescription className=" text-project-text-color">
                                    Your username will be visible to all users.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <div className="flex gap-1 place-items-end">
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className=" text-white">Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            autoComplete="new-password"
                                            type={showPassword ? 'text' : 'password'}  
                                            placeholder={showPassword ? '12345678' : '********'} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className=" text-white">Confirm your password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            autoComplete="new-password"
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder={showPassword ? '12345678' : '********'} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <HideShowPassword togglePasswordVisibility={togglePasswordVisibility} showPassword={showPassword}/>
                            </div>
                            
                            <div className='flex flex-col gap-2'>
                                <p className="text-sm font-medium text-destructive">{wrongPasswordLength ? 'Passwords must have 8 characters or more.' : ''}</p>
                                <p className="text-sm font-medium text-destructive">{passwordsDontMatch ? `The passwords don't match.` : ''}</p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <Button type="submit">Sign up</Button>
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

