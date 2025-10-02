import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorHandler from "../components/errors/ErrorHandler";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import HomePage from "../pages";
import Todos from "../pages/Todos";
import PageNotFound from "../pages/PagNotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";

const storageKey = "loginedUser"
const userLoginData = localStorage.getItem(storageKey)
const userData = userLoginData ? JSON.parse(userLoginData) : null


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Layout />}errorElement={<ErrorHandler/>}>
                <Route index element={
                    <ProtectedRoute
                    isAllowed = {userData?.jwt}
                    redirectPath="/login"
                    data={userData}
                    >
                        <HomePage />
                    </ProtectedRoute>
                }/>
                <Route path="/todos"
                element = {
                    <ProtectedRoute
                    isAllowed = {userData?.jwt}
                    redirectPath="/login"
                    data={userData}>
                    < Todos />
                    </ProtectedRoute>
                } />
                <Route path="login"
                element = {
                    <ProtectedRoute
                    isAllowed = {!userData?.jwt}
                    redirectPath="/"
                    data={userData}>
                    <Login />
                    </ProtectedRoute>
                } />
                <Route path="register"
                element = {
                    <ProtectedRoute
                    isAllowed = {!userData?.jwt}
                    redirectPath="/login"
                    data={userData}>
                    <Register />
                    </ProtectedRoute>
                } />
            </Route>
            // ** Not Found Page */
            <Route path="*" element={<PageNotFound />} />
        </>
    )
)
export default router