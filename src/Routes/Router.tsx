import { lazy } from "react";
import LoaderPage from "../layouts/LoaderPage";
import Welcome from "../Pages/Welcome/Welcome";
import Dashbord from "../Pages/Dashboard/Dashbord";
 import PrivateRoute from "../service/PrivateRoute";

 const Signup = LoaderPage(lazy(async () => await import('../Pages/Registration/Signup')))
const Login = LoaderPage(lazy(async () => await import('../Pages/Registration/Login')))
const CourseForm = LoaderPage(lazy(async () => await import('../Pages/Course/courseForm')))
const VideoForm = LoaderPage(lazy(async () => await import('../Pages/Course/VideoForm')))
const Courses = LoaderPage(lazy(async () => await import('../Pages/Course/Courses')))
// const Sidebar = LoaderPage(lazy(async () => await import('../Components/Sidebar')))
const Logout = LoaderPage(lazy(async () => await import('../Pages/Registration/Logout')))
const Classes = LoaderPage(lazy(async () => await import('../Pages/Class/Classes')))
// const AboutUs = LoaderPage(lazy(async () => await import('../Pages/AboutUs')))
  





const routes = [
    {
        path:'/',
        element:< Welcome />
    }, 
    {
        path:'/Dashboard',
        element:<PrivateRoute path="/dashboard"><Dashbord/></PrivateRoute>
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
        path:'/:courseId/add',
        element:<PrivateRoute path="/:courseId/add"><VideoForm/></PrivateRoute>
     },
    {
        path:'/courseForm',
        element:<PrivateRoute path="/courseForm"><CourseForm/></PrivateRoute>
     },
    {
        path:'/Courses',
        element:<PrivateRoute path="/courses"><Courses/></PrivateRoute>
         
    },
    // {
    //     path:'/Sidebar',
    //     element: <Sidebar/>
    // },
    //  {
    //     path:'/AboutUs',
    //     element:<AboutUs/>
    // },
    {
        path:'/Logout',
        element:<PrivateRoute path="/Logout"><Logout/></PrivateRoute>
     }, 
    {
        path:'/classes',
        element:<PrivateRoute path="/classes"><Classes/></PrivateRoute>
     }, 
    

     
];

export default routes;