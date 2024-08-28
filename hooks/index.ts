import { toast } from '@/components/ui/use-toast'
import { TodoType } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const useTodos = (userId: string) => {
  const fetchTodos = async () => {
    const res = await axios.get<TodoType[]>(`/api/todos/${userId}`)
    return res
  }
  return useQuery({
    queryKey: ['todos', userId],
    queryFn: fetchTodos,
    enabled: !!userId,
  })
}

export const useCreateTodo = (userId: string, reset: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TodoType) => {
      return axios.post<TodoType>(`api/todos/${userId}`, data)
    },
    onSuccess: ({ data }) => {
      toast({
        description: data.message,
      })
      queryClient.invalidateQueries({ queryKey: ['todos', userId] })
      reset()
    },
    onError: (error) => {
      console.log('this error', error)
      toast({
        description: 'Todo already exists. Add new instead!',
      })
    },
  })
}

export const useDeleteTodo = (
  todoId: string,
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => await axios.delete<TodoType>(`api/todos/${todoId}`),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setIsDeleteDialogOpen(false)
      toast({
        description: data.message,
      })
    },
  })
}

export const useUpdateTodo = (
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TodoType }) =>
      await axios.put<TodoType>(`api/todos/${id}`, data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setIsEditDialogOpen(false)
      toast({
        description: data.message,
      })
    },
  })
}

export const useClearCompletedTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => await axios.delete<TodoType>('api/todos'),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast({
        description: data.message,
      })
    },
  })
}

export const useUpdateStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (todoId: string) =>
      await axios.patch<TodoType>(`api/todos/${todoId}`),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast({
        description: data.message,
      })
    },
  })
}
