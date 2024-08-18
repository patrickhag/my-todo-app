'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function Modal() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        router.push('/')
      } else {
        // Handle sign-out error
        console.error('Failed to sign out')
      }
    } catch (error) {
      console.error('An error occurred', error)
    }
  }

  return (
    <div>
      <div className='absolute right-1 top-10 bg-[#F1ECE6]'>
        <Button onClick={handleSignOut} className=''>
          Log out
        </Button>
      </div>
    </div>
  )
}
