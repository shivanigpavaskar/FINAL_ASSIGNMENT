import { Link } from "react-router-dom";
 
function Welcome()  {
  return (
    <div>
      <h1>WELCOME TO THIS PAGE</h1>
      <nav>
            <button><Link to='/Signup'>Signup</Link></button>
            <button><Link to='/Login'>Login</Link></button>
       </nav>
    </div>
  );
}

 export default Welcome