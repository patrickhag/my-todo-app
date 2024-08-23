import { TodoType } from '@/types'
import { useQuery } from '@tanstack/react-query'
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
