import { useState } from "react"
import TodoSkeleton from "../components/TodoSkeleton"
import Paginator from "../components/ui/Pagination"
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery"
import type { ITodo } from "../interface"





function Todos() {
  const TokenKey = "loginedUser"
  const userLoginData = localStorage.getItem(TokenKey)
  const userData = userLoginData ? JSON.parse(userLoginData) : null
  const [page, setPage] = useState<number>(1)

  const {isLoading, data, isFetching} = useAuthenticatedQuery({
    queryKey: [`todo-page-${page}`],
    url: `/todos?pagination[pageSize]=30&pagination[page]=${page}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`
      }
    }
  })

  const onClickNext = () => {
    setPage(prev => prev + 1)
  }

  const onClickPrve = () => {
    setPage(prev => prev - 1)
  }


  return (
    <div className="space-y-1 mb-10 max-w-md mx-auto">
      {isLoading ?
     <div className="space-y-1 p-3">
    {Array.from({length: 3}, (_, idx) => (
      <TodoSkeleton key={idx}/>
    ))}{" "}
  </div>
  : <>
      {data.data?.length ? data.data.map((todo : ITodo, index: number) => (
      <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 rounded-md p-3 even:bg-gray-200/50">
        <p className="w-full font-semibold">{index + 1}  - {todo.title}</p>
      </div>
      )) : <p className="text-center text-lg text-blue-700">No Todos Yet!</p>}</>}
      {isLoading ? <></> :
        <Paginator isLoading={isLoading || isFetching} page={page} pageCount={data.meta.pagination.pageCount} totle={data.meta.pagination.total} onClickNext={onClickNext} onClickPrve={onClickPrve}/>
      }
    </div>
  )
}

export default Todos