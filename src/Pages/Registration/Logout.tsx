  import { useNavigate } from 'react-router-dom';
 const Logout = () => {
    const navigate= useNavigate()


    const handleLogout = () => {

setTimeout(()=>{

   localStorage.removeItem("UserLoggedIn");
   alert("Logout Successful!");
   navigate('/')
   window.location.href = '/'; 


},500)



       
       };
    
     

  return (
    <button  onClick={handleLogout}>Logout</button>
   )
}

export default Logout