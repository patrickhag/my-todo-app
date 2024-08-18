import Image from 'next/image'
import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import Modal from './Modal'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  const [openModal, setOpenModal] = useState(false)

  const { data: session } = useSession()
  return (
    <div className='flex justify-between bg-[#F1ECE6] p-3 my-5 rounded-xl'>
      <div>
        <Link href='/'>
          <Image src='/app-logo.svg' width={100} height={100} alt='App logo' />
        </Link>
      </div>
      <div className='relative'>
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            width={35}
            height={35}
            alt='User profile'
            className='cursor-pointer rounded-full'
            onClick={() => setOpenModal(!openModal)}
          />
        ) : (
          <FaRegUserCircle
            size={35}
            className='text-[#323232] cursor-pointer'
            onClick={() => setOpenModal(!openModal)}
          />
        )}
        {openModal && <Modal />}
      </div>
    </div>
  )
}
