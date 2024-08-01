'use client'
import { deleteTodo, getTodos } from '@/lib/todoApi'
import { TodoType } from '@/lib/types'
import { Checkbox } from '@radix-ui/react-checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { MdDeleteOutline } from 'react-icons/md'

export default function TodoItem({ todo }: { todo: TodoType }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const handleDeleteTodo = () => {
    mutation.mutate(todo.id!)
  }

  return (
    <>
      <li className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          <Checkbox checked={todo.done} className='mr-2' />
          <span
            className={`flex-1 ${
              todo.done ? 'line-through text-gray-400' : ''
            }`}
          >
            {todo.text}
          </span>
        </div>
        <button onClick={handleDeleteTodo}>
          <MdDeleteOutline size={25} className='text-orange-300' />
        </button>
      </li>
    </>
  )
}
