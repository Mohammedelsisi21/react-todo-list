import {Field, Input, Label } from '@headlessui/react'
import clsx from 'clsx'
import Button from '../components/ui/Button'
import { useForm, type SubmitHandler } from "react-hook-form"
import type { IErrorResponse, IValdateReactHook } from '../interface'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerSchema } from '../validation'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axiosInstance from '../config'
import toast from "react-hot-toast";
import type { AxiosError } from 'axios'
import {LoaderCircle} from 'lucide-react'
import InputErrorMassage from '../components/ui/InputErrorMassage'


interface IFormInput {
  username: string
  email: string
  password: string
}

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const rules: IValdateReactHook = {
  required: true,
  pattern: /^[a-zA-Z]{5,}@gmail\.(com|org)$/,
  };

  const { register, handleSubmit ,formState: { errors }} = useForm<IFormInput>({resolver: yupResolver(registerSchema)})
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {

    console.log("data", data)
  setIsLoading(true)
  try {
    const { status } = await axiosInstance.post("/auth/local/register", data)
    if(status === 200) {
    toast.success("You will navigate to the login page after 2 seconds to login.",
      {
        position: "top-center",
        duration: 1500,
        style: {
          background: "black",
          color: "white",
          width: "fit-content"
        }
      }
    )
      setTimeout(()=> {
        navigate("/login")
      }, 2000)
    }
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
  } finally {
    setIsLoading(false)
  }
  }





  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-indigo-700 capitalize text-left">
        Register to get access!
      </h2>
      <form className='bg-[#f5f5f5] w-full px-5 py-2 rounded-md' onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full max-w-md mt-2">
        <Field>
          <Label className="text-lg font-medium text-black">Name</Label>
          <Input {...register("username", {required : true, minLength: 5})}
            className={clsx(
              'mt-1 shadow block w-full rounded-lg border-none bg-indigo-500/5 px-3 py-1.5 text-sm/6 text-black',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-600'
            )}
          />
              {errors.username && <InputErrorMassage msg={errors.username?.message}/>}
        </Field>
      </div>
      <div className="w-full max-w-md mt-2">
        <Field>
          <Label className="text-lg font-medium text-black capitalize">e-mail</Label>
          <Input
            {...register("email", rules)}
            className={clsx(
              'mt-1 shadow block w-full rounded-lg border-none bg-indigo-500/5 px-3 py-1.5 text-sm/6 text-black',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-600'
            )}
          />
              {errors.email && <InputErrorMassage msg={errors.email?.message}/>}
        </Field>
      </div>
      <div className="w-full max-w-md mt-2">
        <Field>
          <Label className="text-lg font-medium text-black capitalize">password</Label>
          <Input
          type='password'
            {...register("password" ,{required: true, minLength: 5})}
            className={clsx(
              'mt-1 shadow block w-full rounded-lg border-none bg-indigo-500/5 px-3 py-1.5 text-sm/6 text-black',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-600'
            )}
          />
          {errors.password && <InputErrorMassage msg={errors.password?.message}/>}
        </Field>
      </div>
      <Button fullWidth className='mt-2 p-2'>{isLoading ? <LoaderCircle className='animate-spin ml-1.5' /> : null}Register</Button>
      </form>
      <p className="text-center mt-3 text-sm font-light text-gray-500">have an account? <Link to="/login" className="text-md font-medium text-indigo-600">Login here</Link></p>
    </div>
  )
}

export default Register