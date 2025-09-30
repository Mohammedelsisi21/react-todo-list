
import * as yup from "yup"


export const registerSchema = yup
    .object({
    "username" : yup.string().required("Username is required").min(5, "Username should be at least 5 charachters"),
    "email" : yup.string().required("E-mail is required").matches(/^[a-zA-Z]{5,}@gmail\.com/,"Not a valid email address"),
    "password" : yup.string().required("Password is required").min(5, "Password should be at least 6 charachters")
    })
.required()


export const loginSchema = yup.object({
    "identifier": yup.string().required("E-mail is required").matches(/^[a-zA-Z]{5,}@gmail\.com/,"Not a valid email address"),
    "password": yup.string().required("Password is required").min(5, "Password should be at least 6 charachters"),
}).required()

export const inputError = yup.object({
    "title": yup.string().required("title is required").min(6, "Title should be at least 6 charachters").max(30, "Title should be at max 30 charachters"),
    "description": yup.string().min(20, "description should be at least 20 charachters"),
}).required()
