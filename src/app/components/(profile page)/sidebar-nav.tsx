"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/library/utils"
import { buttonVariants } from "@/app/components/shadcn-ui/button"
import { useSession } from "next-auth/react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string
        title: string
    }[]
}

export function SidebarNav() {

    const {data: session} = useSession()

    const sidebarNavItems: SidebarNavProps['items'] = [
        {
          title: "Profile",
          href: `/profile/${session?.user.username}/settings/profile`,
        },
        {
          title: "Account",
          href: `/profile/${session?.user.username}/settings/account`,
        },
      ]


    const pathname = usePathname()

    return (
        <nav
            className={cn(
                "flex text-white space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
            )}
        >
            {sidebarNavItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        pathname === item.href
                            ? "bg-slate-300 text-project-blue hover:bg-slate-300"
                            : "hover:underline",
                        "justify-start"
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    )
}