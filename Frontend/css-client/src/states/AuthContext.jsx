// src/states/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';

// 1. Crear el Contexto
export const AuthContext = createContext();

// Función para obtener el usuario desde localStorage
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (e) {
    console.error('Error al parsear el usuario del localStorage:', e);
    // Limpiar si hay un error
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  return null;
};

// 2. Crear el Proveedor (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  
  // Extrae la foto de perfil para un acceso rápido
  const profilePicture = user?.picture || user?.imageUrl || null;

  // Función para iniciar sesión (se llama después de un login exitoso)
  const login = useCallback((userData) => {
    // Asume que UserPage ya guardó 'user' y 'token' en localStorage
    setUser(userData);
  }, []);

  // Función para cerrar sesión (limpia localStorage y estado)
  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('dbUser');
    setUser(null);
  }, []);

  // El valor que se proveerá a todos los componentes hijos
  const contextValue = useMemo(
    () => ({
      user,
      profilePicture,
      isLoggedIn: !!user,
      login,
      logout,
    }),
    [user, profilePicture, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);