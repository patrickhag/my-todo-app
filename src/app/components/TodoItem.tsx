'use client'
import React from 'react'
import { updateStatusTodo } from '@/src/lib/todoApi'
import { TodoType } from '@/src/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FaEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { SiTicktick } from 'react-icons/si'

export default function TodoItem({ todo }: { todo: TodoType }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateStatusTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const handleDoneTask = () => {
    mutation.mutate(todo.id!)
  }

  return (
    <>
      <li className='flex items-center justify-between mb-2 text-xl my-5'>
        <div className='flex items-center'>
          {todo.done ? (
            <SiTicktick
              className='mr-2 text-[#D98326] cursor-pointer'
              size={28}
              onClick={handleDoneTask}
            />
          ) : (
            <input
              type='radio'
              onClick={handleDoneTask}
              className='border-[#737373] cursor-pointer appearance-none mr-2 w-2 h-2 border-2 rounded-full p-2'
            />
          )}
          <span
            className={`flex-1 ${
              todo.done ? 'line-through text-gray-400' : 'text-[#323232]'
            }`}
          >
            {todo.text}
          </span>
        </div>
        <div className='flex'>
          <button>
            <MdDeleteOutline
              size={25}
              className='text-orange-300 hover:text-orange-500 mr-3'
            />
          </button>
          <button>
            <FaEdit
              size={20}
              className='text-orange-300 hover:text-orange-500'
            />
          </button>
        </div>
      </li>
      <div className='border-b border-b-[#76B7CD]'></div>
    </>
  )
}
