import Button from "./ui/Button"
import Loading from "./ui/Loading"
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery"
import Modal from "./ui/Model"
import { useState } from "react"
import { Field, Input, Label } from "@headlessui/react"
import clsx from "clsx"
import type { ITodo } from "../interface"
import Textarea from "./ui/Textarea"

const TodoList = () => {

  const objDefultTodo = {
    id: 0,
    title: "",
    description: "",
  }

  const TokenKey = "loginedUser"
  const userLoginData = localStorage.getItem(TokenKey)
  const userData = userLoginData ? JSON.parse(userLoginData) : null
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(objDefultTodo)
  
  console.log(userData)
  const {isLoading, data} = useAuthenticatedQuery({
    queryKey: ["todo"],
    url: "users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`
      }
    }
  })

  // ** Edit Open And Close Modal
  const onCloseEdit = () => {
    setTodoToEdit(objDefultTodo)
    setIsEditModalOpen(false)
  }
  const onOpenEdit = (todo: ITodo) => {
    setTodoToEdit(todo)
    setIsEditModalOpen(true)
  }

  
  if(isLoading) return <Loading />
  console.log(data)
  return (
    <div className="space-y-1">
      {data.todos?.length ? data.todos.map((todo : ITodo) => (
      <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 rounded-md p-3 even:bg-gray-200/50">
        <p className="w-full font-semibold">1 - {todo.title}</p>
        <div className="flex items-center justify-end w-full space-x-3">
          <Button size={"sm"} onClick={() => onOpenEdit(todo)}>Edit</Button>
          <Button size={"sm"} variant={"danger"} >Remove</Button>
        </div>
      </div>
      )) : <p className="text-center text-lg text-blue-700">No Todos Yet!</p>}
      <Modal title="Edit This Todo" isOpen={isEditModalOpen} closed={()=> onCloseEdit()}>
        <div className="space-y-2">
            <div className="w-full max-w-md mt-2">
          <Field>
            <Label className="text-lg font-medium text-black capitalize">Edit Title</Label>
            <Input
            value={todoToEdit.title}
              className={clsx(
                'mt-1 shadow block w-full rounded-lg border-none bg-indigo-500/5 px-3 py-1.5 text-sm/6 text-black',
                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-600'
              )}
            />
          </Field>
        </div>
        <Textarea value={todoToEdit.description}/>
        <div className="mt-2 flex space-x-1">
          <Button >Update</Button>
          <Button variant={"cancel"} onClick={() => onCloseEdit()}>Cancel</Button>
        </div>
        </div>
      </Modal>
    </div>
  )
}

export default TodoList
