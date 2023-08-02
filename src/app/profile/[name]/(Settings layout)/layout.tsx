import { Separator } from "@/components/shadcn-ui/separator"
import { SidebarNav } from "@/components/(ProfilePage)/sidebar-nav"
import Navigation from "@/components/(NavBar)/Navigation/Navigation"
import { Provider } from "@/components/Provider/Provider"
import { Toaster } from "@/components/shadcn-ui/toaster"

import { Metadata } from "next"
import './page.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth"
import { options } from "@/app/api/auth/[...nextauth]/options"


const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
    title: "SmartBrain",
    description: "User settings configuration.",
     icons: {
        icon: './icon.png',
    },
}

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default async function Layout({ children }: SettingsLayoutProps) {

    const session = await getServerSession(options)

    return (
        <html lang="en">
            <body suppressHydrationWarning={true} className={`${inter.className} bg-project-blue`}>
                <Provider>
                    <Navigation serverSession={session}/>
                    <div className="space-y-6 p-10 pb-20 md:block">
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-bold tracking-tight text-white">Settings</h2>
                            <p className="text-slate-300">
                                Manage your account settings.
                            </p>
                        </div>
                        <Separator className="my-6" />
                        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                            <aside className="-mx-4 lg:w-1/5">
                                <SidebarNav />
                            </aside>
                            <div className="flex-1 lg:max-w-2xl">{children}</div>
                        </div>
                    </div>
                    <Toaster />
                </Provider>
            </body>
        </html>
    )
}