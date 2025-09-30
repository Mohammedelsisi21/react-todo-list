import Button from "./ui/Button"
import Loading from "./ui/Loading"
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery"
import Modal from "./ui/Model"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { Field, Input, Label } from "@headlessui/react"
import clsx from "clsx"
import type { ITodo } from "../interface"
import Textarea from "./ui/Textarea"
import axiosInstance from "../config"
import { inputError } from "../validation"
import * as yup from "yup"

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
  const [msgError, setMsgError] = useState<{ title?: string; description?: string }>({});
  const [isUpdating, setIsUpdating] = useState(false);
  
  const {isLoading, data} = useAuthenticatedQuery({
    queryKey: ["todoList", `${todoToEdit.documentId}`],
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

  const onChangeHandler = (event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {value , name} = event.target
    setTodoToEdit(
      {...todoToEdit,
        [name]: value
      }
    )
  }

  const onSubmitHandler = async (event : FormEvent<HTMLFormElement> ) => {
    event.preventDefault()
    setIsUpdating(true)
    try {
      await inputError.validate(todoToEdit, {abortEarly: false})

      setMsgError({})

      const {title , description} = todoToEdit
      const { status } = await axiosInstance.put(`/todos/${todoToEdit.documentId}`,
      {
        "data": {title, description},
      },{
        headers: {
          Authorization: `Bearer ${userData.jwt}`
        }
      })
      if(status === 200) {
        onCloseEdit()
      }
    } catch (err : any) {
       if (err.name === 'ValidationError') {
      // اجمع كل الأخطاء في object
      const errors: { [key: string]: string } = {};
      err.inner.forEach((e: yup.ValidationError) => {
        if (e.path) errors[e.path] = e.message;
      });
      setMsgError(errors);
    } else {
      console.log(err);
    }
    }finally {
      setIsUpdating(false)
    }
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
        <form className="space-y-2" onSubmit={onSubmitHandler}>
          <div className="w-full max-w-md mt-2">
            <Field>
              <Label className="text-lg font-medium text-black capitalize">Edit Title</Label>
              <Input
              name="title" onChange={onChangeHandler}
              value={todoToEdit.title}
                className={clsx(
                  'mt-1 shadow block w-full rounded-lg border-none bg-indigo-500/5 px-3 py-1.5 text-sm/6 text-black',
                  'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-600'
                )}
              />
            </Field>
            {msgError.title && <p className="text-red-500">{msgError.title}</p>}
          </div>
          <Textarea
          name="description" value={todoToEdit.description} onChange={onChangeHandler}/>
            {msgError.description && <p className="text-red-500">{msgError.description}</p>}
          <div className="mt-2 flex space-x-1">
            <Button isLoading={isUpdating}>Update</Button>
            <Button variant={"cancel"} onClick={() => onCloseEdit()}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TodoList
