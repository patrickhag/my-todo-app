import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { openSans, pattaya } from './ui/fonts'
import { signIn } from '@/src/auth'
import gitHub from '../../../public/github-icon.svg'
import gmail from '../../../public/google-icon.svg'

export default async function Login() {
  ;('use client')
  return (
    <div className='flex items-center justify-center min-h-screen bg-[#F1ECE6]'>
      <div className='text-center'>
        <h1 className={`${pattaya.className} text-4xl font-bold mb-4`}>
          Task -Tracker
        </h1>
        <p className={`${openSans.className} mb-8`}>
          Login and get to manage your tasks!
        </p>
        <div className='space-x-4 flex'>
          <form
            action={async () => {
              'use server'
              await signIn('github', {
                redirectTo: '/todo',
              })
            }}
          >
            <Button className='bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded flex items-center justify-center w-40 mb-4 mx-auto'>
              <Image
                src={gitHub}
                alt='GitHub'
                className='h-6 w-6 mr-2'
                width={30}
                height={30}
                priority={true}
              />
              github
            </Button>
          </form>
          <form
            action={async () => {
              'use server'
              await signIn('google', {
                redirectTo: '/todo',
              })
            }}
          >
            <Button className='bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded flex items-center justify-center w-40 mx-auto'>
              <Image
                src={gmail}
                alt='Google'
                className='h-6 w-6 mr-2'
                width={30}
                height={30}
                priority={true}
              />
              google
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
