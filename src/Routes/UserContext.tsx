 import { createContext, useContext } from 'react';

interface UserContextProps {
  designation: 'Student' | 'Trainer';
  children?: React.ReactNode;

}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<UserContextProps> = ({ children, designation }) => {
  return (
    <UserContext.Provider value={{ designation }}>
      {children}
    </UserContext.Provider>
  );
};
