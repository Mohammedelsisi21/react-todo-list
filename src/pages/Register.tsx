import {Field, Input, Label } from '@headlessui/react'
import clsx from 'clsx'
import Button from '../components/ui/Button'
import { useForm, type SubmitHandler } from "react-hook-form"
import type { IValdateReactHook } from '../interface'

interface IFormInput {
  name: string
  email: string
  password: string
}

const Register = () => {
  const rules: IValdateReactHook = {
  required: true,
  pattern: /^[a-zA-Z]{5,}@gmail\.(com|org)$/,
  };

  const { register, handleSubmit ,formState: { errors }} = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)
  
  console.log(errors)
  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-indigo-700 capitalize text-left">
        Register to get access!
      </h2>
      <form className='bg-[#f5f5f5] w-full px-5 py-2 rounded-md' onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full max-w-md mt-2">
        <Field>
          <Label className="text-lg font-medium text-black">Name</Label>
          <Input {...register("name", {required : true, minLength: 5})}
            className={clsx(
              'mt-1 shadow block w-full rounded-lg border-none bg-indigo-500/5 px-3 py-1.5 text-sm/6 text-black',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-600'
            )}
          />
              {errors.name?.type === "required" && (<p role="alert" className='text-red-500'>First name is required</p>)}
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
              {errors.email && errors.email?.type === "required" && (<p role="alert" className='text-red-500'>First name is required</p>)}
        </Field>
      </div>
      <div className="w-full max-w-md mt-2">
        <Field>
          <Label className="text-lg font-medium text-black capitalize">password</Label>
          <Input
            {...register("password" ,{required: true, minLength: 5})}
            className={clsx(
              'mt-1 shadow block w-full rounded-lg border-none bg-indigo-500/5 px-3 py-1.5 text-sm/6 text-black',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-indigo-600'
            )}
          />
            {errors.password?.type === "required" && (<p role="alert" className='text-red-500'>First name is required</p>)}
        </Field>
      </div>
      <Button fullWidth className='mt-2 p-2'>Register</Button>
      </form>
    </div>
  )
}

export default Register