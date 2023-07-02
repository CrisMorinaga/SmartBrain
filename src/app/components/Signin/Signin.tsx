"use client"

// import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"

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
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
// import { Checkbox } from "@/app/components/ui/checkbox"
// TODO: Create a checkbox with 'remember me' option.

 
const formSchema = z.object({
  username: z.string().min(2,{message: 'Username must be between 2 and 40 characters long.'}).max(40),
    // message: 'test' // This is the error message that appears on the screen (Uses default if not specified)
  password: z.string().min(8, {message: 'Passwords must be at least 8 characters long'}),
//   mobile: z.boolean().default(false).optional(),
  
})

export function Signin() {
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
            // redirect:true,
            // callbackUrl: `/profile/${values.username}`
        });
    };

    return (
        <div className="container mt-20">
            <div className="center">
                <div className="w-[400px] border rounded m-4 bg-project-boxes">
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
                                    <Input placeholder="username / email@..." {...field} />
                                </FormControl>
                                <FormDescription className=" text-project-text-color">
                                    Type your username or email.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            {/* Password */}
                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className=" text-white">Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

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

                            <Button type="submit">Login</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
      )
  }

