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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import Loader from './Loader'
import { updateTodo } from '@/lib/todo-api'
import { TodoType } from '@/types'
import { toast } from './ui/use-toast'

export default function EditTaskModal({
  id,
  task,
  setIsEditDialogOpen,
}: {
  id: string
  task: string
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
      toast({
        description: `Todo updated successfully!`,
      })
    },
  })

  const onSubmit: SubmitHandler<TodoType> = (data) => {
    mutation.mutate({ id, data })
  }

  useEffect(() => {
    setValue('text', task)
  }, [task, setValue])

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
