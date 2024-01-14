  import { useNavigate } from 'react-router-dom';
  import './Logout.css'
 
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
   <>
   <div className="mybox">
   <h3>Done Studying?</h3> <br/>
    <h3>Click To Log Out</h3><br/>
     <button className='mybtn' onClick={handleLogout}>Logout</button>
   </div>
   
   </>
   )
}

export default Logout