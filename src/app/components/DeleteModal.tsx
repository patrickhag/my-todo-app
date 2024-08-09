import { deleteTodo } from '@/src/lib/todoApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BsExclamationCircle } from 'react-icons/bs'
import { FaTimes } from 'react-icons/fa'

export default function DeleteTodoModal({
  showDeleteModal,
  handleShowDeleteModal,
  taskId,
}: {
  showDeleteModal: boolean
  taskId: string
  handleShowDeleteModal: () => void
}) {
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      handleShowDeleteModal()
    },
  })

  const queryClient = useQueryClient()

  const handleDeleteTodo = () => {
    deleteMutation.mutate(taskId!)
  }

  return (
    <div
      className={`${
        showDeleteModal ? 'block' : 'hidden'
      } fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)]`}
    >
      <div className='relative p-4 w-full mx-auto mt-40 max-w-md'>
        <div className='relative bg-white rounded-lg shadow'>
          <button
            type='button'
            className='absolute top-3 end-2.5 hover:bg-[#E5E7EB] hover:text-[#111827] rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
            onClick={handleShowDeleteModal}
          >
            <FaTimes size={20} className='text-[#A08D8D]' />
            <span className='sr-only'>Close modal</span>
          </button>
          <div className='p-4 md:p-5 text-center'>
            <BsExclamationCircle className='w-14 h-14 text-[#9CA3AF] mx-auto mb-4' />
            <h3 className='mb-5 text-lg font-normal text-gray-500'>
              Are you sure you want to delete this task?
            </h3>
            <button
              type='button'
              className='text-white bg-[#DC2626] hover:bg-[#B91C1C] focus:ring-4 focus:outline-none focus:ring-[#FCA5A5] font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
              onClick={handleDeleteTodo}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : "Yes, I'm sure"}
            </button>
            <button
              type='button'
              className='py-2.5 px-5 ms-3 text-sm font-medium text-[#1F2937] focus:outline-none bg-white rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] hover:text-[#1D4ED8] focus:z-10 focus:ring-4 focus:ring-[#F3F4F6]'
              onClick={handleShowDeleteModal}
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
