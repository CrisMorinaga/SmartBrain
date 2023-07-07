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
import { useSession } from "next-auth/react"

const FormSchema = z.object({
    username: z.string()
        .min(2, {message: "Username must be at least 2 characters.",
        }).max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
})

type ProfileFormValues = z.infer<typeof FormSchema>

export function ProfileForm() {
        
    const { data: session } = useSession()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            username: ""
        }
    })
    // TODO: Finish onSubmit data requests and search on how to add profile pic
    function onSubmit(data: ProfileFormValues) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Username</FormLabel>
                            <FormControl>
                                <Input placeholder={session?.user.username} {...field} />
                            </FormControl>
                            <FormDescription className=" text-project-text-color">
                                This is your public display name. It can be your real name or a
                                pseudonym.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className=" project-button" type="submit">Update profile</Button>
            </form>
        </Form>
    )
}