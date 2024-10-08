'use client'
import { TodoType } from '@/types'
import { FaEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { SiTicktick } from 'react-icons/si'
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
} from '@/components/ui/alert-dialog'
import { IoRadioButtonOffOutline } from 'react-icons/io5'
import { useState } from 'react'
import { Dialog, DialogTrigger } from './ui/dialog'
import EditTaskModal from './EditModal'
import Loader from './Loader'
import { useDeleteTodo, useUpdateStatus } from '@/hooks'

export default function TodoItem({ todo }: { todo: TodoType }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const handleCompletedTodoMutation = useUpdateStatus()

  const handleDoneTask = () => {
    handleCompletedTodoMutation.mutate(todo.id!)
  }

  const deleteMutation = useDeleteTodo(todo.id!, setIsDeleteDialogOpen)

  const handleDeleteTodo = () => {
    deleteMutation.mutate()
  }

  return (
    <>
      <div className='flex items-center justify-between mb-2 my-5'>
        <div className='flex items-center'>
          {todo.done ? (
            <SiTicktick
              className='mr-2 text-[#D98326] cursor-pointer'
              size={28}
              onClick={handleDoneTask}
            />
          ) : handleCompletedTodoMutation.isPending ? (
            <Loader typeOfLoader={true} />
          ) : (
            <div className='relative group'>
              <IoRadioButtonOffOutline
                onClick={handleDoneTask}
                className='border-[#737373] cursor-pointer appearance-none mr-2 border-2 rounded-full p-3'
              />
              <span className='opacity-0 group-hover:opacity-100 transition-opacity absolute top-[-35px] left-0 bg-gray-700 text-white text-sm rounded px-2 py-1'>
                Complete
              </span>
            </div>
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
              <span>
                <MdDeleteOutline
                  size={25}
                  className='text-orange-300 hover:text-orange-500 mr-3 cursor-pointer'
                  onClick={() => setIsDeleteDialogOpen(true)}
                />
              </span>
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
                  {deleteMutation.isPending ? (
                    <Loader text='Deleting...' />
                  ) : (
                    'Yes, Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <span>
                <FaEdit
                  size={20}
                  className='text-orange-300 hover:text-orange-500 cursor-pointer'
                />
              </span>
            </DialogTrigger>
            <EditTaskModal
              id={todo.id!}
              task={todo.text}
              setIsEditDialogOpen={setIsEditDialogOpen}
            />
          </Dialog>
        </div>
      </div>
      <div className='border-b border-b-[#76B7CD] my-3'></div>
    </>
  )
}
