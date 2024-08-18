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
import { todoData, todoSchema } from '@/src/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'

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
  } = useForm<todoData>({
    defaultValues: {
      text: task,
      description: description,
    },
    resolver: zodResolver(todoSchema),
  })

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: todoData }) =>
      updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setIsEditDialogOpen(false)
    },
  })

  const onSubmit: SubmitHandler<todoData> = (data) => {
    mutation.mutate({ id, data })
  }

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
          <Input
            id='description'
            {...register('description')}
            className='col-span-3'
          />
        </div>
        <DialogFooter>
          <Button
            type='submit'
            disabled={isSubmitting || mutation.isPending}
            className='bg-blue-500'
          >
            {isSubmitting || mutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
