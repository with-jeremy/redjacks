import type { Metadata } from 'next'
import Link from "next/link"
import { Inter, Dancing_Script } from "next/font/google"

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import './globals.css'


const inter = Inter({ subsets: ["latin"] })
const dancingScript = Dancing_Script({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Red Jacks Entertainment',
  description: 'Find and purchase tickets',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-background text-foreground antialiased`}>
          <nav className="bg-background border-b border-blood">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="main-nav flex-1 flex justify-center space-x-28">
                <Link href="/shows" className="text-xl text-blood pt-4">
                  Events
                </Link>
                <Link href="/" className={`text-6xl font-bold text-blood ${dancingScript.className}`}>
                  Red Jacks
                </Link>
                <Link href="/account" className="text-xl text-blood pt-4">
                  My Tickets
                </Link>
              </div>
              <div className="auth-nav flex items-center space-x-4">
                <SignedOut>
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">{children}</main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <div className="container mx-auto text-center px-4 py-8">
            Website by Jeremy@WithJeremy.com - Copyright 2025 <Link href="/dashboard">@</Link> Red Jacks Entertainment
            </div>
      </footer>

        </body>
      </html>
    </ClerkProvider>
  )
}