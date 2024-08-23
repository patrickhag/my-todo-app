import React from 'react'
import '@/app/globals.css'

type Prop = {
  text?: string
}

const Loader = ({ text }: Prop) => {
  return (
    <div className='flex items-center'>
      <div className='loader'></div>
      <span className='ml-2'>{text}</span>
    </div>
  )
}

export default Loader
