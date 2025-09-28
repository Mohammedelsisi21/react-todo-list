import { Field ,Input, Label } from "@headlessui/react"
import clsx from "clsx"
import Button from "../components/ui/Button"
import { useForm, type SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { loginSchema } from "../validation"
import type { IErrorResponse, IValdateReactHook } from "../interface"
import axiosInstance from "../config"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import type { AxiosError } from "axios"
import { useState } from "react"
import { LoaderCircle } from "lucide-react"
import InputErrorMassage from "../components/ui/InputErrorMassage"

interface IFormInput {
  identifier: string
  password: string
}
const rules: IValdateReactHook = {
required: true,
pattern: /^[a-zA-Z]{5,}@gmail\.(com|org)$/,
};

function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  })
  const onSubmit: SubmitHandler<IFormInput> = async (data) =>
      { 
        console.log(data)
    try {
      const { status } = await axiosInstance.post("/auth/local", data)

      if(status === 2000) {
        toast.success("You will navigate to the login page after 2 seconds to home", {
          position: "top-center",
          duration: 1500,
          style: {
            background: "black",
            color: "white",
            width: "fit-content"
          }
        })
      }
      setTimeout(() => {
        navigate("/")
      })
    } catch (error) {
      console.log(error)
    const errorObj = error as AxiosError<IErrorResponse>
    toast.error(`${errorObj.response?.data.error.message}`, {
        position: "top-center",
        duration: 1500,
        style: {
          background: "black",
          color: "white",
          width: "fit-content"
      }
    })
    }finally {
    setIsLoading(false)
  }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-indigo-700 capitalize text-left">
        Login to get access!
      </h2>
      <form className='bg-[#f5f5f5] w-full px-5 py-2 rounded-md' onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full max-w-md mt-2">
        <Field>
          <Label className="text-lg font-medium text-black capitalize">e-mail</Label>
          <Input
          {...register("identifier", rules)}
            className={clsx(
              'mt-1 shadow block w-full rounded-lg border-none bg-indigo-500/5 px-3 py-1.5 text-sm/6 text-black',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-600'
            )}
          />
              {errors.identifier && <InputErrorMassage msg={errors.identifier?.message}/>}
        </Field>
      </div>
      <div className="w-full max-w-md mt-2">
        <Field>
          <Label className="text-lg font-medium text-black capitalize">password</Label>
          <Input
          {...register("password")}
          type='password'
            className={clsx(
              'mt-1 shadow block w-full rounded-lg border-none bg-indigo-500/5 px-3 py-1.5 text-sm/6 text-black',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-600'
            )}
          />
              {errors.password && <InputErrorMassage msg={errors.password?.message}/>}
        </Field>
      </div>
            <Button fullWidth className='mt-2 p-2'>{isLoading ? <LoaderCircle className='animate-spin ml-1.5' /> : null}Login</Button>
      </form>
    </div>
  )
}

export default Login