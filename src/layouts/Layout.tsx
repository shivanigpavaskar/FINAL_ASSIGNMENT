import { ReactNode } from "react";
import { Box } from  "@mui/material";

interface LayoutProps{
    children:ReactNode
}

 
 
 const Layout = ({ children }:LayoutProps) => {
   return (
    <Box sx={{ backgroundColor:"pink",
display:"flex",
flexDirection:{
    xs:"column",
    lg:"row"
},
color:"white",
padding:3,
gap:3,
overflow:"hidden",
height:"100vh"
}}
    >

    </Box>
   )
 }
 
 export default Layout