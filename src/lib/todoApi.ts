import axios from 'axios'
import { API_URL } from './definitions'
import { TodoType } from './types'

export async function getTodos() {
  try {
    const data = await axios.get<TodoType[]>(API_URL)
    return data
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message)
  }
}

export async function addTodo(data: TodoType) {
  try {
    const res = await axios.post<TodoType>(API_URL, data, {
      headers: {
        'Content-type': 'application/json',
      },
    })

    return res
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message)
  }
}

export async function updateStatusTodo(id: string) {
  try {
    const res = await axios.patch<TodoType>(`${API_URL}/${id}`)
    return res
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message)
  }
}

export async function clearCompletedTodos() {
  try {
    const res = await axios.delete<TodoType>(`${API_URL}`)
    return res
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message)
  }
}
