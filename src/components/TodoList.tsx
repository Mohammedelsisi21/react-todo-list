import Button from "./ui/Button"
import Loading from "./ui/Loading"
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery"

const TodoList = () => {

  const TokenKey = "loginedUser"
  const userLoginData = localStorage.getItem(TokenKey)
  const userData = userLoginData ? JSON.parse(userLoginData) : null

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
  
  if(isLoading) return <Loading />
  console.log(data)
  return (
    <div className="space-y-1">
      {data.todos?.length ? data.todos.map(todo => (
      <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 rounded-md p-3 even:bg-gray-200/50">
        <p className="w-full font-semibold">1 - {todo.title}</p>
        <div className="flex items-center justify-end w-full space-x-3">
          <Button size={"sm"}  >Edit</Button>
          <Button size={"sm"} variant={"danger"} >Remove</Button>
        </div>
      </div>
      )) : <p className="text-center text-lg text-blue-700">No Todos Yet!</p>}
    </div>
  )
}

export default TodoList