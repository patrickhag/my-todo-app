export type ParamType = { id: string }

export type TodoType = {
  id?: string
  text: string
  description?: string
  done: boolean
  message?: string
}

export type Error = {
  message: string
}

export type TodoResponse = {
  data: TodoType[]
}

export type User = {
  id: string
  email: string
  name: string
}

export type addTodoDataReponse = {
  message: string
}
