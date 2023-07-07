"use client"

// import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useState } from "react"

import Image from 'next/image'
import hide from './hide.png'
import show from './show.png'

// Ui
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
import { Button } from "@/app/components/shadcn-ui/button"
import { signIn } from "next-auth/react"
import axios from "@/library/axios"

 
const formSchema = z.object({

    firstName: z.string()
        .max(30, {message: `Please don't go over 30 characters`}),
    lastName: z.string()
        .max(30, {message: `Please don't go over 30 characters`}),
    email: z.string().email(),
    username: z.string()
        .min(2,{message: 'Username must be between 2 and 20 characters long.'})
        .max(20, {message: 'Username must be between 2 and 20 characters long.'}),
    password: z.string()
        .min(8, {message: 'Passwords must have 8 characters or more'}),
    confirmPassword: z.string(),
    passwordsDontMatch: z.string()

}).superRefine(({ confirmPassword, password}, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: 'custom',
            message: "The passwords don't match",
            path: ['passwordsDontMatch']
        })
    }
})

type Props = {
    catchError: () => void
}

export function Signup({catchError}:Props) {

    const [ showPassword, setShowPassword ] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            passwordsDontMatch: ""
        },
    })
   
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
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
            })
        } catch (error) {
            console.log(`error: `, error);
            catchError();
            return
        }
    }
    // TODO: Fix error messages on password that are overlapping when passwords are not the same and are less than 8 characters long.
    return (
        <div className="container my-10">
            <div className="center">
                <div className="w-[400px] border rounded m-4 bg-project-boxes">
                    <Form {...form}>
                        <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-4">

                            <div className="flex gap-3">
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
                            
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className=" text-white">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@mail.com" {...field} />
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
                                    <Input placeholder="Something cool" {...field} />
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
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder={showPassword ? '12345678' : '********'} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                    <Image
                                    height={30}
                                    className="cursor-pointer border rounded bg-white mb-1"
                                    onClick={togglePasswordVisibility} 
                                    src={showPassword ? hide : show} alt=''
                                    />
                            </div>
                            <FormField
                            control={form.control}
                            name="passwordsDontMatch"
                            render={() => (
                                <FormMessage style={{marginTop: 8}} />
                            )}
                            />
                            <Button type="submit">Sign up</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
      )
  }

