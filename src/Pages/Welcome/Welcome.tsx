import { Link } from 'react-router-dom';
import './welcome.css'; 
import img4 from '../../assets/images/img4.png'
 import Footer from '../../layouts/footer';

const Welcome = () => {
  return (
    <div>
      <h1 className="h1">WELCOME TO EASY LEARNING!</h1>
        <div>
        <img className="logo-img" src={img4}   alt="" />
      </div>

      <div>
        <div className="container">
           <button className="button-one"><Link   className='link-style' to="/login">LOG IN</Link></button>
        </div>
        <div className="container">
          <button className="button-two"><Link  className='link-style' to="/signup">SIGN UP</Link></button>
        </div>
      </div>
      <Footer/>
     </div>
  );
}

export default Welcome;
