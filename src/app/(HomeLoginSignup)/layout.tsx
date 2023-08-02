import Navigation from '@/components/(NavBar)/Navigation/Navigation'
import Particle from '@/components/Particle/Particle'
import { Toaster } from "@/components/shadcn-ui/toaster"
import { Provider } from '@/components/Provider/Provider'

import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { options } from '../api/auth/[...nextauth]/options'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'SmartBrain',
};

export default async function RootLayout({ children }:  { children: React.ReactNode})  {

    const session = await getServerSession(options)

    return (
        <html lang="en">
           <body suppressHydrationWarning={true} className={`${inter.className} bg-gradient-to-l from-project-boxes-border to-project-lighter-magenta`}>
                <Provider>
                    <Particle />
                    <Navigation serverSession={session}/>
                    {children}
                    <Toaster />
                </Provider>
            </body>
        </html>
    )
}
