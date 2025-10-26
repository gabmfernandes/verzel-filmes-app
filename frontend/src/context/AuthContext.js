import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin } from '../services/api'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carrega o token do localStorage na inicialização
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Nota: Idealmente, deveria-se checar se o token não expirou.
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await apiLogin(username, password);
      const { access } = response.data;
      
      // Persistência: salva o token no localStorage
      localStorage.setItem('access_token', access);
      
      setIsLoggedIn(true);
      return true;
      
    } catch (error) {
      throw error; 
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    // Limpa tokens de refresh, se houver
    localStorage.removeItem('refresh_token'); 
    setIsLoggedIn(false);
  };
  
  // O token de refresh e auto-refresh devem ser implementados, mas não são críticos para este desafio.

  const contextValue = {
    isLoggedIn,
    login,
    logout,
  };

  if (loading) {
    // Tela de carregamento enquanto verifica o token
    return <div>Verificando sessão...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};