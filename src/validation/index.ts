
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