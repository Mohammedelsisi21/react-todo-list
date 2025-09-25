import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorHandler from "../components/errors/ErrorHandler";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import HomePage from "../pages";
import Todos from "../pages/Todos";
import PageNotFound from "../pages/PagNotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";



const isAllowed = false;


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Layout />}errorElement={<ErrorHandler/>}>
                <Route index element={
                    <ProtectedRoute
                    isAllowed = {isAllowed}
                    redirectPath="/login"
                    // data={}
                    >
                        <HomePage />
                    </ProtectedRoute>
                }/>
                <Route path="/profile"
                element = {
                    <ProtectedRoute
                    isAllowed = {isAllowed}
                    redirectPath="/login"
                    // data={}
                    >
                    <h2>Profile page</h2>
                    </ProtectedRoute>
                } />
                <Route path="/todos"
                element = {
                    <ProtectedRoute
                    isAllowed = {isAllowed}
                    redirectPath="/login"
                    // data={}
                    >
                    < Todos />
                    </ProtectedRoute>
                } />
                <Route path="login"
                element = {
                    <ProtectedRoute
                    isAllowed = {!isAllowed}
                    redirectPath="/"
                    // data={}
                    >
                    <Login />
                    </ProtectedRoute>
                } />
                <Route path="register"
                element = {
                    <ProtectedRoute
                    isAllowed = {!isAllowed}
                    redirectPath="/login"
                    // data={}
                    >
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