import toast from "react-hot-toast"


interface IProps {
    message: string
    
    status: "success" | "error" | "loading"
}
const Toast = ({message , status} : IProps) => {
  return (
        toast[status](message, {
            position: "top-center",
            duration: 1500,
            style: {
            color: "white",
            background: "black",
            width: "fit-content"
            }
        })

  )
}

export default Toast