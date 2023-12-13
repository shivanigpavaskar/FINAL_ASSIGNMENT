import { lazy } from "react";
import LoaderPage from "../layouts/LoaderPage";
import Welcome from "../Welcome";
import Courses from "../Pages/Courses";

const Home = LoaderPage(lazy(async () => await import('../Home')))
const Signup = LoaderPage(lazy(async () => await import('../Pages/Signup')))
const Login = LoaderPage(lazy(async () => await import('../Pages/Login')))
  
 

const routes = [
    {
        path:'/',
        element:< Welcome />
    },

     {
        path:'/Home',
        element:<Home/>
    },
    {
        path:'/Signup',
        element:<Signup/>
    },
    {
        path:'/Login',
        element:<Login/>
    },
    {
        path:'/Courses',
        element:<Courses/>
    }

];

export default routes;