import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
title: 'SmartBrain',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning={true} lang="en">
        <body className={`${inter.className} bg-gradient-to-l from-project-boxes-border to-project-lighter-magenta`}>{children}</body>
    </html>
  )
}