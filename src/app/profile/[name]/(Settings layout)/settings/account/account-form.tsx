"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/shadcn-ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/shadcn-ui/form"
import { Input } from "@/components/shadcn-ui/input"
import { toast } from "@/components/shadcn-ui/use-toast"
import { ToastAction } from '@/components/shadcn-ui/toast'
import HideShowPassword from "@/components/HideShowPassword"

import { useRef, useState } from "react"
import useAxiosAuth from '@/library/hooks/useAxiosAuth'
import { signOut, useSession } from 'next-auth/react'
import { AxiosError } from 'axios'



const accountFormSchema = z.object({
    firstName: z
        .string()
        .max(30, {message: "Please don't go over 30 characters"})
        .optional()
        .or(z.literal('')),
    lastName: z
        .string()
        .max(30, {message: "Please don't go over 30 characters"})
        .optional()
        .or(z.literal('')),
    email: z
        .string()
        .email()
        .optional()
        .or(z.literal('')),
    password: z
        .string()
        .optional()
        .or(z.literal('')),
    confirmPassword: z
        .string()
        .optional()
        .or(z.literal('')),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

const defaultValues: Partial<AccountFormValues> = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
}

export function AccountForm() {
    const form = useForm<AccountFormValues>({
        mode:'onChange',
        resolver: zodResolver(accountFormSchema),
        defaultValues,
    })

    const { data: session, update } = useSession()
    const axiosAuth = useAxiosAuth();

    const [ showPassword, setShowPassword ] = useState(false);
    const [ wrongPasswordLength, setWrongPasswordLength ] = useState(false);
    const [ passwordsDontMatch, setPasswordsDontMatch ] = useState(false);

    let password = useRef('')
    let confirmPassword = useRef('')

    const lastName = session?.user.name.split(' ')[0]
    const firstName = session?.user.name.split(' ')[1]


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
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

                } if (password.length < 8 && password.length !== 0) {
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

    async function onSubmit(data: AccountFormValues) {

        if (wrongPasswordLength || passwordsDontMatch) {
            // Avoid sending the form.
            return
        } else {

            const name = (data.lastName?.toLowerCase() || '') + ' ' + (data.firstName?.toLowerCase() || '');

            let updatedUser = {
                ...session?.user,
                ...(name.trim() !== '' && { name: name }),
                ...(data.email !== '' && { email: data.email }),
            };

            let currentUser = {
                ...session?.user,
                name: session?.user.name.toLowerCase()
            }

            if ((JSON.stringify(updatedUser) === JSON.stringify(currentUser)) && data.password === '') {
                toast({
                    description: "You haven't made any changes.",
                });
            } else {

                try {
                    const updateAccount = await axiosAuth.patch('/update-account', {
                        id: session?.user.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        password: data.password,
                    })
    
                    toast({
                        description: 'Your account has been updated',
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
                            toast({
                                variant: "destructive",
                                title: 'There was a problem with your request',
                                description: "Your new password must not be the same as your previous one.",
                            })
                            return
                        }
                    } else {
                        console.log(error)
                    }
                }
            }
        }
    }

    return (
        <Form {...form}>
            <form 
            method="POST" 
            onChange={(e)=>handleChange(e)}
            onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex gap-3">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={firstName} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={lastName} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <p 
                className="text-project-text-color text-sm text-muted-foreground"
                >This is the name that will be displayed on your profile and in emails.</p>

                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className=" text-white">Email</FormLabel>
                    <FormControl>
                        <Input autoComplete='username' placeholder={session?.user.email} {...field} />
                    </FormControl>
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
                        <FormLabel className=" text-white">New password</FormLabel>
                        <FormControl>
                            <Input 
                                autoComplete='new-password'
                                type={showPassword ? 'text' : 'password'}  
                                placeholder={showPassword ? '12345678' : '********'} {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className=" text-white">Confirm your new password</FormLabel>
                        <FormControl>
                            <Input 
                                autoComplete='new-password'
                                type={showPassword ? 'text' : 'password'} 
                                placeholder={showPassword ? '12345678' : '********'} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div>
                        <HideShowPassword togglePasswordVisibility={togglePasswordVisibility} showPassword={showPassword}/>
                    </div>
                </div>
                
                <div className='flex flex-col gap-2'>
                    <p className="text-sm font-medium text-destructive">{wrongPasswordLength ? 'Passwords must have 8 characters or more.' : ''}</p>
                    <p className="text-sm font-medium text-destructive">{passwordsDontMatch ? `The passwords don't match.` : ''}</p>
                </div>

                <Button className="project-button" type="submit">Update account</Button>
            </form>
        </Form>
    )
}