"use client"

// import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import hide from "./hide.png"
import show from "./show.png"

// Ui
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { signIn } from "next-auth/react"
import axios from "@/library/axios"
import { useState } from "react"
// import { Checkbox } from "@/app/components/ui/checkbox"
// TODO: Create a checkbox with 'remember me' option.

 
const formSchema = z.object({

    firstName: z.string().max(30),
    lastName: z.string().max(30),
    email: z.string().email(),
    username: z.string().min(2,{message: 'Username must be between 2 and 20 characters long.'}).max(20),
    password: z.string().min(8, {message: 'Passwords must have 8 characters or more'}),
    confirmPassword: z.string().min(8)

}).superRefine(({ confirmPassword, password}, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: 'custom',
            message: "The passwords don't match",
            path: ['confirmPassword']
        })
    }
})

export function Signup() {

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
            confirmPassword: ""
        },
    })
   
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        const register = await axios.post('/register', {
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            email: values.email,
            password: values.password
        })

        console.log(register.data)

        const result = await signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect:true,
            callbackUrl: `/profile/${values.username}`
        })

    }

    return (
        <div className="container my-10 ">
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
                            <div className="flex gap-3 items-center ">
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
                                {/* <p 
                                onClick={togglePasswordVisibility}
                                className="cursor-pointer text-white border rounded text-center">
                                    {showPassword ? 'Hide Password' : 'Show Password'}
                                </p> */}
                            </div>

                            {/* Checkbox(Rememeber me) */}
                            {/* <FormField
                                control={form.control}
                                name="mobile"
                                render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                    Use different settings for my mobile devices
                                    </FormLabel>
                                    <FormDescription>
                                    You can manage your mobile notifications in the{" "}
                                    <Link href="/examples/forms">mobile settings</Link> page.
                                    </FormDescription>
                                </div>
                                </FormItem>
                            )}
                            /> */}

                            <Button type="submit">Sign up</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
      )
  }

