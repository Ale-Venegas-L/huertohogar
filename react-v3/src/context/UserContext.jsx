import { createContext, useState } from "react";

// Contexto para manejar el estado del usuario (logueado o no, datos del usuario)
export const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = () => {
    // Clear user data
    setUser(null);
    // Clear all stored session data
    localStorage.removeItem('usuario');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    return true; // Indicate success
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};