import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface PrivateRouteProps {
    path:string
    children?: React.ReactNode; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ path,children }) => {
    console.log(`${path}`)
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated:', isAuthenticated); 

  return isAuthenticated.loggedIn? (
    children
   ) : (
    <Navigate to="/" replace={true} state={{from:path}}/>
  );
};

export default PrivateRoute;
