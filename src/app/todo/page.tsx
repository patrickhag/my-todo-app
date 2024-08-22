'use client'
import React, { useEffect, useState } from 'react'
import { todoData, todoSchema } from '@/src/lib/schema'
import { useMutation, useQuery } from '@tanstack/react-query'
import { GoTasklist } from 'react-icons/go'
import TodoItem from '../components/TodoItem'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { addTodo, clearCompletedTodos, getTodos } from '@/src/lib/todoApi'
import Header from '../components/Header'
import { Button } from '../components/ui/button'
import { useSession } from 'next-auth/react'
import { BulletList } from 'react-content-loader'
import Loader from '../components/Loader'

export default function Todo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<todoData>({ resolver: zodResolver(todoSchema) })

  const [showError, setShowError] = useState(false)

  const { data: session } = useSession()

  const userId = session?.user?.id as string

  useEffect(() => {
    if (errors.text) {
      setShowError(true)
      const timer = setTimeout(() => {
        setShowError(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errors.text])

  const {
    data: todos = { data: [] },
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['todos', userId],
    queryFn: async () => (userId ? await getTodos(userId) : { data: [] }),
    enabled: !!userId,
  })

  const addTodoMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: todoData }) =>
      addTodo(userId!, data),
    onSuccess: () => {
      refetch()
      reset()
    },
  })

  const onSubmit: SubmitHandler<todoData> = (data) => {
    addTodoMutation.mutate({ userId, data })
  }

  const clearCompletedTodosMutation = useMutation({
    mutationFn: clearCompletedTodos,
    onSuccess: () => {
      refetch()
    },
  })

  return (
    <>
      <div className='container px-5 sm:w-full md:w-9/12 lg:w-7/12'>
        <Header />
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

              <Button
                className='absolute right-0 top-0 min-h-full px-4 text-white bg-blue-500 rounded-lg'
                type='submit'
              >
                {addTodoMutation.isPending ? (
                  <Loader text='Adding...' />
                ) : (
                  'Add'
                )}
              </Button>
            </form>
          </div>
          {showError && errors.text && (
            <p className='text-[#721c24] text-xs font-light my-3 border-[#f8d7da] bg-[#f8d7da] rounded-md p-2'>
              {errors.text.message}
            </p>
          )}

          {isLoading && (
            <div className='bg-[#F1ECE6] shadow-md rounded-xl p-6 text-center'>
              <BulletList />
            </div>
          )}
          <div
            className={`
             bg-[#F1ECE6] shadow-md rounded-xl p-6 text-center`}
          >
            {todos.data.length!! === 0 ? (
              <p className='text-gray-500'>No todos yet. Add them instead!</p>
            ) : (
              <ul>
                {todos.data.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </ul>
            )}
            {todos?.data.length!! > 0 && (
              <div className='flex justify-end'>
                <Button
                  className='mt-4 flex items-center space-x-2 border bg-blue-500'
                  onClick={() => clearCompletedTodosMutation.mutate()}
                  disabled={!todos.data.some((todo) => todo.done)}
                >
                  <span>
                    {clearCompletedTodosMutation.isPending ? (
                      <Loader text='Clearing...' />
                    ) : (
                      <div className='flex items-center py-3'>
                        <GoTasklist size={20} />
                        <span className='ml-2 text-sm'>Clear completed</span>
                      </div>
                    )}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
