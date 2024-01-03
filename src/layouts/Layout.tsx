import React,{ReactNode} from 'react';
import img2 from "../assets/images/img2.png";
import './layout.css';

interface LayoutProps {
  children: ReactNode;
}




const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="wrapper">
      
       <img src={img2} alt="Sample" className="image-fixed" />

       <main className="container">
        <h2>Easy Learning</h2>
        </main>
        {children}
       <footer className="footer">
        <div>
          <a style={{color:"white"}}   href="/privacy-policy">Privacy Policy</a> | <span>&copy; {new Date().getFullYear()} Easy Learning</span>
        </div>
      </footer>

    </div>
  );
}

export default Layout;
