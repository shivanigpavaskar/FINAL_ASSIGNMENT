import { Link } from 'react-router-dom';
import './footer.css'


const Footer = () => (
    <footer className="footer">
      <div>
        <Link style={{ color: "white" }} to="/privacy-policy">Privacy Policy</Link> | <span>&copy; {new Date().getFullYear()} Easy Learning</span>
      </div>
    </footer>
  );
  
  export default Footer;