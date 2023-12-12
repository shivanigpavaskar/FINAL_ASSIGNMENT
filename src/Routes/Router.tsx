import { lazy } from "react";
import LoaderPage from "../layouts/LoaderPage";
import Welcome from "../Welcome";

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
    }

];

export default routes;