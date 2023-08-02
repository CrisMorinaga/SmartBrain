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

 
const formSchema = z.object({
    username: z.string(),
    password: z.string(),
})

type Props = {
    catchError: (userDoesntExist: boolean) => void
}

export function Signin({catchError}: Props) {

    const [ showPassword, setShowPassword ] = useState(false);
    const router = useRouter();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    // 1. Define your form.

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        
        const result = await signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect:false,
        });

        if (result?.error?.includes('404')) {
            catchError(true)
        } else if (result?.error?.includes('401')) {
            catchError(false)
            console.log(result.error)
            console.log('new error')
        } else {
            router.push(`/profile/${values.username}`)
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
                            
                            <Button type="submit">Login</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
      )
  }

