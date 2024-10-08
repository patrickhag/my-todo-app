'use client'
import { useEffect, useState } from 'react'
import { GoTasklist } from 'react-icons/go'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { BulletList } from 'react-content-loader'
import { todoSchema } from '@/lib/schema'
import TodoItem from '@/components/TodoItem'
import { Button } from '@/components/ui/button'
import Loader from '@/components/Loader'
import Header from '@/components/Header'
import { useClearCompletedTodo, useCreateTodo, useTodos } from '@/hooks'
import { TodoType } from '@/types'

export default function Todo() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoType>({ resolver: zodResolver(todoSchema) })

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

  const { data: todos, isLoading, refetch } = useTodos(userId)

  const addTodoMutation = useCreateTodo(userId, reset)

  const onSubmit: SubmitHandler<TodoType> = (data) => {
    addTodoMutation.mutate(data)
  }

  const clearCompletedTodosMutation = useClearCompletedTodo()

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
                disabled={addTodoMutation.isPending}
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

          <div className='bg-[#F1ECE6] shadow-md rounded-xl p-6 text-center'>
            {isLoading ? (
              <BulletList />
            ) : todos?.data.length ?? 0 > 0 ? (
              <ul>
                {todos?.data.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </ul>
            ) : (
              <p className='text-gray-500'>No tasks yet. Add them instead!</p>
            )}

            {!!todos?.data.length && todos.data.length > 0 && (
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
