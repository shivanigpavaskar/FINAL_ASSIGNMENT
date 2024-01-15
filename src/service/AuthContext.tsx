import React, { createContext, useContext, useState, ReactNode } from 'react';
 
interface AuthContextProps{
  children: ReactNode;
}



interface AuthState{
loggedIn : boolean;
designation: string|null;
email: string|null;

}


interface AuthContextType {
  isAuthenticated: AuthState;
  login: (user:AuthState) =>void
  logout: () => void;
}

const AuthContext = createContext<null|AuthContextType>(null);



 const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<AuthState>(()=>{
    const storedUser = localStorage.getItem('UserLoggedIn');
    return storedUser ? JSON.parse(storedUser) : { loggedIn: false, designation: null };
  });









  const login = (user:AuthState)=>{
    setAuthenticated({loggedIn:true, designation:user.designation , email:user.email});
    localStorage.setItem('UserLoggedIn', JSON.stringify(user));

  }

  const logout = () => {
    setAuthenticated({loggedIn:false, designation:null,email:null});
    localStorage.removeItem('UserLoggedIn');

   
  };

 const authContextValue:AuthContextType={
isAuthenticated,
login,
logout,

 };



  return (
    <AuthContext.Provider value={ authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return auth;
};

 export default AuthProvider;