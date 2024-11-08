
'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
function Navbar() {

    const { data: session } = useSession()

    const user: User = session?.user as User

    return (
        <nav className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Brand Name Link */}
            <Link href="/" className="text-white text-2xl font-semibold hover:text-gray-400">
                Mistry Message
            </Link>
    
            {/* Conditional User/Sign-In Section */}
            <div className="flex items-center space-x-4">
                {session ? (
                    <>
                        <span className="text-white">Welcome, {user?.username}</span>
                        <Button onClick={() => signOut()} className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md">
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link href="/sign-in">
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                                Sign In
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    </nav>
    
    )
}

export default Navbar
