'use client'
import React from 'react'
import Link from 'next/link'
import { useSession,signOut, SessionProvider } from 'next-auth/react'
import {User} from "next-auth"
import { Button } from './ui/button'



const Navbar = ({children}:any) => {
    const { data } = useSession()
    const user: User= data?.user as User;
  return (
    <SessionProvider>
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row items-center justify-between'>
            <Link className='text-xl font-bold mb-4 md:mb-0' href="#">Mystery Message</Link>{
                data ? (
                    <>
                    <span className='mr-4'>Welcome {user?.username || user?.email}</span>
                    <Button className='w-full md:w-auto' onClick={()=>signOut()}>Logout</Button>
                    </>
                ):(
                    <>
                    <Link href={"/sign-in"}><Button className='w-full md:w-auto'>Login</Button></Link>
                    </>
                )
            }
        </div>
    </nav>
    </SessionProvider>
  )
}

export default Navbar
