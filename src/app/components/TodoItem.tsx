'use client'
import { TodoType } from '@/src/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FaEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { SiTicktick } from 'react-icons/si'
import { deleteTodo, updateStatusTodo } from '@/src/lib/todoApi'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/app/components/ui/alert-dialog'
import { useState } from 'react'
import { Dialog, DialogTrigger } from './ui/dialog'
import EditTaskModal from './EditModal'

export default function TodoItem({ todo }: { todo: TodoType }) {
  const queryClient = useQueryClient()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const mutation = useMutation({
    mutationFn: updateStatusTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const handleDoneTask = () => {
    mutation.mutate(todo.id!)
  }

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setIsDeleteDialogOpen(false)
    },
  })

  const handleDeleteTodo = () => {
    deleteMutation.mutate(todo.id!)
  }

  return (
    <>
      <li className='flex items-center justify-between mb-2 my-5'>
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
              className='border-[#737373] cursor-pointer appearance-none mr-2 border-2 rounded-full p-3'
              title='Mark as done'
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
          <AlertDialog open={isDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <MdDeleteOutline
                size={25}
                className='text-orange-300 hover:text-orange-500 mr-3 cursor-pointer'
                onClick={() => setIsDeleteDialogOpen(true)}
              />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                  No, Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteTodo}
                  disabled={deleteMutation.isPending}
                  className='bg-red-600 hover:bg-red-800 '
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <FaEdit
                size={20}
                className='text-orange-300 hover:text-orange-500 cursor-pointer'
              />
            </DialogTrigger>
            <EditTaskModal
              id={todo.id!}
              task={todo.text}
              description={todo.description!}
              setIsEditDialogOpen={setIsEditDialogOpen}
            />
          </Dialog>
        </div>
      </li>
      <div className='border-b border-b-[#76B7CD]'></div>
    </>
  )
}
