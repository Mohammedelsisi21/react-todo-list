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
import TodoSkeleton from "./TodoSkeleton"
import Toast from "./ui/Toast"
import InputErrorMassage from "./ui/InputErrorMassage"
import { faker } from '@faker-js/faker';


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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(objDefultTodo)
  const [todoToAdd, setTodoToAdd] = useState<ITodo>(objDefultTodo)
  const [msgError, setMsgError] = useState<{ title?: string; description?: string }>({});
  const [isUpdatingLoading, setIsUpdatingLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isDeletedTodo, setIsDeletedTodo] = useState(false);
  const [quaryVarsion, setQuaryVarsion] = useState(1);
  
  
  const {isLoading, data} = useAuthenticatedQuery({
    queryKey: ["todoList", `${quaryVarsion}`],
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

    // ** Added Open And Close Modal
  const onCloseAdded = () => {
    setTodoToAdd(objDefultTodo)
    setIsAddModalOpen(false)
  }
  const onOpenAdded = () => setIsAddModalOpen(true)


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

  const onGenerateTodos = async () => {

    for (let todo = 1; todo < 100 ; todo++) {
    try {
      const { data } = await axiosInstance.post("/todos",
        {
          data: {
            title: faker.word.words(4) ,
            description: faker.lorem.paragraph(2),
          }
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`
          }
        }
      );
      console.log(data)
    } catch (error) {
      console.log(error)
  }
  }
  }

  
  const onChangeAddHandler = (event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {value , name} = event.target
    setTodoToAdd({...todoToAdd,
      [name]: value
    })
    console.log(todoToAdd)
  }

  


  //** Remove */
  const onRemove = async () => {
    try {
      const {status } = await axiosInstance.delete(`todos/${todoToEdit.documentId}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`
        }
      })
      console.log(status)
      if (status === 204) {
          Toast({message: "Todo deleted successfully" , status: "success"})
          onConformClose()
          setQuaryVarsion(prev => prev + 1)
        }
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmitHandler = async (event : FormEvent<HTMLFormElement> ) => {
    event.preventDefault()
    setIsUpdatingLoading(true)
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
        Toast({message: "Todo Edit successfully", status: "success"})
        onCloseEdit()
          setQuaryVarsion(prev => prev + 1)
        
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
      setIsUpdatingLoading(false)
    }
  }

  const onSubmitAddHandler = async (event : FormEvent<HTMLFormElement> ) => {
    event.preventDefault()
    setIsAddLoading(true)
    try {
      await inputError.validate(todoToAdd, {abortEarly: false})
      setMsgError({})
      const {title, description} = todoToAdd
      const { status } = await axiosInstance.post("/todos",
        {
          data: {
            title,
            description,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`
          }
        }
      );
      if( status  === 201 ) {
        Toast({message: "Todo Added successfully", status: "success"})
        onCloseAdded()
          setQuaryVarsion(prev => prev + 1)
      }
    } catch (error: any) {
      if(error.name === "ValidationError") {
        const errors : {[key: string]:string} = {}
        error.inner.forEach((e: yup.ValidationError) => {
          if(e.path) errors[e.path] = e.message
        })
        setMsgError(errors)
      }
    }finally {
      setIsAddLoading(false)
    }
  }


  return (
    <div className="space-y-1 mb-10">
      {isLoading ? <>
      <div className="flex items-center space-x-2">
        <div className="h-9 bg-gray-300 rounded-md dark:bg-gray-700 w-32"></div>
        <div className="h-9 bg-gray-300 rounded-md dark:bg-gray-700 w-32"></div>
      </div>
      </> : <>
        <div className="flex space-x-2 my-10 items-center justify-center">
        <Button variant={"default"} size={"sm"} onClick={onOpenAdded}>Post new todo</Button>
        <Button variant={"outline"} size={"sm"} onClick={onGenerateTodos}>Generate todos</Button>
        </div>
      </>}
     {isLoading ?
     <div className="space-y-1 p-3">
    {Array.from({length: 3}, (_, idx) => (
      <TodoSkeleton key={idx}/>
    ))}{" "}
  </div>
  : <>
      {data.todos?.length ? data.todos.map((todo : ITodo, index: number) => (
      <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 rounded-md p-3 even:bg-gray-200/50">
        <p className="w-full font-semibold">{index + 1}  - {todo.title}</p>
        <div className="flex items-center justify-end w-full space-x-3">
          <Button size={"sm"} onClick={() => onOpenEdit(todo)}>Edit</Button>
          <Button size={"sm"} variant={"danger"} onClick={() => onConformOpen(todo)}>Remove</Button>
        </div>
      </div>
      )) : <p className="text-center text-lg text-blue-700">No Todos Yet!</p>}</>}

      {/* // * Added Modal  */}
      <Modal title="Added the todo" isOpen={isAddModalOpen} closed={() => {onCloseAdded()}}>
          <form className="space-y-2" onClick={onSubmitAddHandler}>
          <div className="w-full max-w-md mt-2">
            <Field>
              <Label className="text-lg font-medium text-black capitalize">Title</Label>
              <Input
              name="title"
              onChange={onChangeAddHandler}
                className={clsx(
                  'mt-1 shadow block w-full rounded-lg border-none bg-indigo-500/5 px-3 py-1.5 text-sm/6 text-black',
                  'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-600'
                )}
              />
            </Field>
            {msgError.title && <InputErrorMassage msg={msgError.title}/>}
          </div>
          <label className="text-lg font-medium text-black capitalize">description</label>
          <Textarea
          onChange={onChangeAddHandler}
          name="description"/>
            {msgError.description && <InputErrorMassage msg={msgError.description}/>}
          <div className="mt-2 flex space-x-1">
            <Button isLoading={isAddLoading}>Add Post</Button>
            <Button variant={"cancel"} onClick={() => onCloseAdded()}>Cancel</Button>
          </div>
        </form>
      </Modal>
      
        {/* // * Edit Modal  */}
      <Modal title="Edit This Todo" isOpen={isEditModalOpen} closed={()=> onCloseEdit()}>
        <form className="space-y-2" onSubmit={onSubmitHandler}>
          <div className="w-full max-w-md mt-2">
            <Field>
              <Label className="text-lg font-medium text-black capitalize">Title</Label>
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
            <Button isLoading={isUpdatingLoading}>Update</Button>
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
