import { FaTimes } from 'react-icons/fa'

export default function EditTaskModal({
  showEditModal,
  handleShowEditModal,
}: {
  showEditModal: boolean
  handleShowEditModal: () => void
}) {
  console.log(showEditModal)
  return (
    <>
      <div
        className={`${
          showEditModal ? 'block' : 'hidden'
        } fixed z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className='relative p-5 w-10/12 mx-auto mt-28 max-w-md max-h-full'>
          <div className='relative bg-white rounded-lg shadow'>
            <div className='flex items-center justify-between p-4 md:p-5 border-b border-b-gray-200 rounded-t'>
              <h3 className='text-xl font-semibold text-[#111827] text-center'>
                Edit Task
              </h3>
              <button
                type='button'
                className='end-2.5 text-[#9CA3AF] bg-transparent hover:bg-[#E5E7EB] hover:text-[#111827] rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
                onClick={handleShowEditModal}
              >
                <FaTimes size={20} className='text-[#A08D8D]' />
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            <div className='p-4 md:p-5'>
              <form className='space-y-4'>
                <div>
                  <input
                    type='text'
                    id='name'
                    className='bg-[#f4f5f7] border-[#D1D5DB] text-[#111827] text-sm rounded-lg focus:ring-[#3B82F6] focus:border-[#3B82F6] block w-full p-2.5'
                  />
                </div>
                <div>
                  <textarea className='bg-[#f4f5f7] border-[#D1D5DB] text-[#111827] text-sm rounded-lg focus:ring-[#3B82F6] focus:border-[#3B82F6] block w-full p-2.5 h-44 resize-none'></textarea>
                </div>
                <button
                  type='submit'
                  className='w-full text-[#FFFFFF] hover:bg-[#1877F2] bg-[#377eda] focus:ring-4 focus:outline-none focus:ring-[#93C5FD] font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                >
                  Edit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
