'use client'
import React, { useEffect, useState } from 'react'
import { todoData, todoSchema } from '@/src/lib/schema'
import { useMutation, useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import { FcDeleteDatabase } from 'react-icons/fc'
import TodoItem from '../components/TodoItem'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { addTodo, clearCompletedTodos, getTodos } from '@/src/lib/todoApi'

export default function Todo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<todoData>({ resolver: zodResolver(todoSchema) })

  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (errors.text) {
      setShowError(true)
      const timer = setTimeout(() => {
        setShowError(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errors.text])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => await getTodos(),
  })

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      refetch()
      reset()
    },
  })

  const onSubmit: SubmitHandler<todoData> = (data) => {
    addTodoMutation.mutate(data)
  }

  const clearCompletedTodosMutation = useMutation({
    mutationFn: clearCompletedTodos,
    onSuccess: () => {
      refetch()
    },
  })

  // sort based on the completeness the completed tasks be the last
  const sortedTodos = data?.data.sort((a, b) => {
    if (a.done && !b.done) {
      return 1
    }
    if (!a.done && b.done) {
      return -1
    }
    return 0
  })

  return (
    <>
      <div className='container sm:w-full md:w-9/12 lg:w-7/12'>
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

              <Button className='absolute right-0 top-0 min-h-full px-4 text-white bg-blue-500 rounded-lg'>
                {addTodoMutation.isPending ? 'Adding...' : 'Add'}
              </Button>
            </form>
          </div>
          {showError && errors.text && (
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
            {sortedTodos?.length === 0 && (
              <p className='text-gray-400'>No tasks yet. Add them instead!</p>
            )}
            <div className='flex justify-end'>
              <Button
                className='mt-4 flex items-center space-x-2 border bg-blue-500'
                onClick={() => clearCompletedTodosMutation.mutate()}
              >
                <FcDeleteDatabase />
                <span>
                  {clearCompletedTodosMutation.isPending
                    ? 'Clearing...'
                    : 'Clear completed'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
