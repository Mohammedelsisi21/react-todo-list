import { useState, type ChangeEvent } from "react"
import TodoSkeleton from "../components/TodoSkeleton"
import Paginator from "../components/ui/Pagination"
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery"
import type { ITodo } from "../interface"





function Todos() {
  const TokenKey = "loginedUser"
  const userLoginData = localStorage.getItem(TokenKey)
  const userData = userLoginData ? JSON.parse(userLoginData) : null
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(15)
  const [sortRrecord, setSortRrecord] = useState<string>("asc")
  const {isLoading, data, isFetching} = useAuthenticatedQuery({
    queryKey: [`todo-page-${page}-${pageSize}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortRrecord}`,
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

  const onChangeSize = (e : ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value)
  }

  const onChangeSort = (e : ChangeEvent<HTMLSelectElement>) => {
    setSortRrecord(e.target.value)
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

    <div className="flex items-center justify-center space-x-3 mb-10">
      <div className="relative">
        <select value={sortRrecord} onChange={onChangeSort} className="appearance-none border-2 border-indigo-600 rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="asc">Oldest</option>
          <option value="desc">Latest</option>
        </select>
        <span className="absolute right-2 top-2.5 text-gray-500 pointer-events-none">▼</span>
      </div>


      <div className="relative">
        <select value={pageSize} onChange={onChangeSize} className="appearance-none border-2 border-indigo-600 rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="absolute right-2 top-2.5 text-gray-500 pointer-events-none">▼</span>
      </div>
    </div>

    
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