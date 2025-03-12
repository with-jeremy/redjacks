import { Dancing_Script, Abel } from 'next/font/google';

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

import Link from 'next/link';
import './globals.css';

const abel = Abel({ weight: '400', subsets: ['latin'] });
const dancingScript = Dancing_Script({ subsets: ['latin'] });

export const metadata = {
  title: 'Red Jacks Entertainment',
  description: 'Find and purchase tickets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${abel.className} bg-background text-foreground antialiased`}>
          <nav className="bg-background border-b border-blood">
            <div className="container mx-auto pl-2 pr-2 md:px-4 py-4 flex justify-between items-center">
              <div className="main-nav flex-1 flex justify-between pl-6 pr-2 lg:pl-12">
                <Link href="/shows" className="text-xl text-blood pt-4">
                  Events
                </Link>
                <Link href="/" className={`text-4xl px-6 md:text-6xl font-bold text-blood ${dancingScript.className}`}>Red Jacks</Link>
                <Link href="/account" className="text-xl text-blood pt-4">
                  Tickets
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
              <p>
                Website by Jeremy@WithJeremy.com - Copyright 2025 <Link href="/dashboard">@</Link> Red Jacks Entertainment
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}