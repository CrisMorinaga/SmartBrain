import Navigation from './components/(nav bar)/Navigation/Navigation'
import Particle from './components/Particle/Particle'
import { Provider } from './components/Provider/Provider'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
title: 'SmartBrain',
}

export default function RootLayout({ children }:  { children: React.ReactNode})  {

    return (
        <html lang="en">
           <body suppressHydrationWarning={true} className={`${inter.className} bg-gradient-to-l from-project-boxes-border to-project-lighter-magenta`}>
           <Provider>
                <Navigation/>
                <Particle/>
                {children}
            </Provider>

            </body>
        </html>
    )
}
