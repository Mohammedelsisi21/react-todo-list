import { LoaderCircle } from "lucide-react"

const Loading = () => {
  return (
    <div className="flex justify-center items-center">
        <LoaderCircle className="animate-spin text-2xl text-indigo-700"/>
    </div>
  )
}

export default Loading