 import  { useState ,ReactNode} from 'react';
import '../App.css'


 import {
     FaBars,
     FaBook,
    FaTh, FaUserAlt,
 } from "react-icons/fa"
import { NavLink } from 'react-router-dom'


interface SidebarProps {
   children: ReactNode;
 }


 const Sidebar: React.FC<SidebarProps>  = ({children}) => {
   const[isOpen,setIsOpen] =useState(false)
   const toggle =()=>setIsOpen(!isOpen)

const  menuItem=[
    {
       path:"/",
       name:"Dashboard",
       icon:<FaTh/>
    },
    {
        path:"/Courses",
        name:"Courses",
        icon:<FaUserAlt/>
     },
     {
        path:"/Classes",
        name:"Classes",
        icon:<FaBook/>
     },
     
]









   return (
     <div className='container'>
<div  style={{width:isOpen  ? "180px" : "50px"}}     className="sidebar">
    <div className="top_section">
 <h1  style={{display:isOpen  ? "block" : "none"}}       className="logo">Logo</h1>  
 <div   style={{marginLeft:isOpen  ? "180px" : "0px"}}         className="bars">
    <FaBars onClick={toggle}/>
 </div>
 
   </div>
   {
    menuItem.map((item,index)=>(
        <NavLink to={item.path} key={index} className="link">
            <div className="icon">{item.icon}</div>
            <div className="link_text">{item.name}</div>
        </NavLink>
    ))
   }
</div>
<main>{children}</main>
     </div>




   )
 }
 
 export default Sidebar