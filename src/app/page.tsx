'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FcDeleteDatabase } from 'react-icons/fc'
import { FaRegUserCircle } from 'react-icons/fa'
import TodoItem from '../components/todo-item'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { todoSchema, todoData } from '@/lib/schema'
import { addTodo, getTodos } from '@/lib/todoApi'
import { useMutation, useQuery } from '@tanstack/react-query'

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<todoData>({ resolver: zodResolver(todoSchema) })

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: async () => await getTodos(),
    queryKey: ['todos'],
  })

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      refetch()
    },
  })

  const onSubmit: SubmitHandler<todoData> = (data) => {
    mutation.mutate(data)
  }

  return (
    <div className='container w-7/12'>
      <div className='flex justify-between bg-[#F1ECE6] p-5 my-5 rounded-xl'>
        <div>
          <Image src='/app-logo.svg' width={100} height={100} alt='App logo' />
        </div>
        <div>
          <FaRegUserCircle size={35} className='text-[#323232]' />
        </div>
      </div>
      <div className='mt-20'>
        <div className='relative mb-4'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type='text'
              {...register('text', { required: 'Text is required' })}
              name='text'
              className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500'
              placeholder='What do you need to do?'
            />

            <Button className='absolute right-0 top-0 min-h-full px-4 text-white bg-blue-500 rounded-lg'>
              ADD
            </Button>
          </form>
        </div>
        {errors.text && (
          <p className='text-red-500 text-xs font-light my-3'>
            {errors.text.message}
          </p>
        )}
        <div className='bg-[#F1ECE6] shadow-md rounded-xl p-6'>
          {isLoading ? (
            <p>Loading ...</p>
          ) : isError ? (
            <p>Retrying ...</p>
          ) : (
            <ul>
              {data?.data.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          )}
          <div className='flex justify-end'>
            <Button className='mt-4 flex items-center space-x-2 border bg-blue-500'>
              <FcDeleteDatabase />
              <span>Clear Completed</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
