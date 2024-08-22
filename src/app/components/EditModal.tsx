import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from './ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { updateTodo } from '@/src/lib/todoApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoData } from '@/src/lib/schema'
import { useEffect } from 'react'
import { Textarea } from '@/src/app/components/ui/textarea'
import { TodoType } from '@/src/lib/types'
import Loader from './Loader'

export default function EditTaskModal({
  id,
  task,
  description,
  setIsEditDialogOpen,
}: {
  id: string
  task: string
  description: string
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm<TodoType>()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TodoType }) =>
      updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setIsEditDialogOpen(false)
    },
  })

  const onSubmit: SubmitHandler<TodoType> = (data) => {
    mutation.mutate({ id, data })
  }

  useEffect(() => {
    setValue('text', task)
    setValue('description', description)
  }, [description, task, setValue])

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Edit task</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Make your todo more descriptive by adding description.
      </DialogDescription>
      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-4'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='task' className='text-start'>
            Task
          </Label>
          <Input id='task' {...register('text')} className='col-span-3' />
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='description' className='text-start'>
            Description
          </Label>
          <Textarea
            id='description'
            {...register('description')}
            className=' col-span-3 resize-none'
          />
        </div>
        <DialogFooter>
          <Button
            type='submit'
            disabled={isSubmitting || mutation.isPending}
            className='bg-blue-500'
          >
            {isSubmitting || mutation.isPending ? (
              <Loader text='Saving...' />
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
