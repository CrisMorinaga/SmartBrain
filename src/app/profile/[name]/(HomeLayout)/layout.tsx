import Navigation from '../../../components/(nav bar)/Navigation/Navigation'
import Particle from '../../../components/Particle/Particle'
import { Provider } from '../../../components/Provider/Provider'
import './page.css'
import { Inter } from 'next/font/google'
import { Toaster } from "@/app/components/shadcn-ui/toaster"


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'SmartBrain',
};

export default function Layout({ children }:  { children: React.ReactNode})  {

    return (
        <html lang="en">
           <body suppressHydrationWarning={true} className={`${inter.className} bg-gradient-to-l from-project-boxes-border to-project-lighter-magenta`}>
                <Provider>
                    <Particle />
                    <Navigation/>
                    {children}
                    <Toaster />
                </Provider>
            </body>
        </html>
    )
}
