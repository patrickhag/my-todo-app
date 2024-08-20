import axios from 'axios'
import { API_URL } from './definitions'
import { TodoResponse, TodoType } from './types'

export async function getTodos(userId: string) {
  try {
    const id = userId
    const data = await axios.get<TodoType[]>(`${API_URL}/${id}`)
    return data
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message)
  }
}

export async function addTodo(userId: string, data: TodoType) {
  const id = userId
  try {
    const res = await axios.post<TodoType>(`${API_URL}/${id}`, data, {
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
export async function deleteTodo(id: string) {
  try {
    const res = await axios.delete<TodoType>(`${API_URL}/${id}`)
    return res
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message)
  }
}

// update a todo using put

export async function updateTodo(id: string, data: TodoType) {
  try {
    const res = await axios.put<TodoType>(`${API_URL}/${id}`, data)
    return res
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message)
  }
}
