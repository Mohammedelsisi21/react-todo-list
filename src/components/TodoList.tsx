import Button from "./ui/Button"
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
import toast from "react-hot-toast"
import TodoSkeleton from "./TodoSkeleton"
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
  const [isDeletedTodo, setIsDeletedTodo] = useState(false);
  
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

  // ** Remove Open And Close Modal
  const onConformOpen = (todo : ITodo) => {
    setTodoToEdit(todo)
    setIsDeletedTodo(true)
  }
  const onConformClose = () => {
    setTodoToEdit(objDefultTodo)
    setIsDeletedTodo(false)
  }



  //**  HHandlers */
  //** Edit & updating */
  const onChangeHandler = (event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {value , name} = event.target
    setTodoToEdit(
      {...todoToEdit,
        [name]: value
      }
    )
  }

  const onRemove = async () => {
    try {
      const {status } = await axiosInstance.delete(`todos/${todoToEdit.documentId}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`
        }
      })
      console.log(status)
      if (status === 204) {
          toast.success("Todo deleted successfully", {
            position: "top-center",
            duration: 1500,
            style: {
              background: "black",
              color: "white",
              width: "fit-content"
            }
          })
          onConformClose()
        }
    } catch (error) {
      console.log(error)
    }
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

  
  if(isLoading) return (
  <div className="space-y-1 p-3">
    {Array.from({length: 3}, (_, idx) => (
      <TodoSkeleton key={idx}/>
    ))}{" "}
  </div>)
  
  return (
    <div className="space-y-1">
      {data.todos?.length ? data.todos.map((todo : ITodo, index: number) => (
      <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 rounded-md p-3 even:bg-gray-200/50">
        <p className="w-full font-semibold">{index + 1}  - {todo.title}</p>
        <div className="flex items-center justify-end w-full space-x-3">
          <Button size={"sm"} onClick={() => onOpenEdit(todo)}>Edit</Button>
          <Button size={"sm"} variant={"danger"} onClick={() => onConformOpen(todo)}>Remove</Button>
        </div>
      </div>
      )) : <p className="text-center text-lg text-blue-700">No Todos Yet!</p>}

        {/* // * Edit Modal  */}
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

        {/* //* Remove Modal */}
        <Modal
        isOpen={isDeletedTodo}
        closed={onConformClose}
        title="Are you sure you want to remove this todo from your store ?"
        description="Deleting this todo will remove it permenantly from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
        >
          <div className="flex space-x-2">
                <Button variant={"danger"} onClick={onRemove}>Yes, Remove</Button>
                <Button variant={"cancel"} onClick={onConformClose}>cancel</Button>
          </div>
        </Modal>
    </div>
  )
}

export default TodoList
