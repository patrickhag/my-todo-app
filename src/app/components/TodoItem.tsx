'use client'
import { TodoType } from '@/src/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FaEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { SiTicktick } from 'react-icons/si'
import { updateStatusTodo } from '@/src/lib/todoApi'
import DeleteTodoModal from './DeleteModal'
import EditTaskModal from './EditModal'

export default function TodoItem({
  todo,
  showDeleteModal,
  handleShowDeleteModal,
  showEditModal,
  handleShowEditModal,
}: {
  todo: TodoType
  showDeleteModal: boolean
  handleShowDeleteModal: () => void
  showEditModal: boolean
  handleShowEditModal: () => void
}) {
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
      {showDeleteModal && (
        <DeleteTodoModal
          showDeleteModal={showDeleteModal}
          handleShowDeleteModal={handleShowDeleteModal}
          taskId={todo.id!}
        />
      )}

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
              className='border-[#737373] cursor-pointer appearance-none mr-2 border-2 rounded-full p-3'
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
              onClick={handleShowDeleteModal}
            />
          </button>
          <button>
            <FaEdit
              size={20}
              className='text-orange-300 hover:text-orange-500'
              onClick={handleShowEditModal}
            />
          </button>
        </div>
      </li>
      <div className='border-b border-b-[#76B7CD]'></div>

      {showEditModal && (
        <EditTaskModal
          showEditModal={showEditModal}
          handleShowEditModal={handleShowDeleteModal}
        />
      )}
    </>
  )
}
