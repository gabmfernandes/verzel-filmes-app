import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import SharedList from './pages/SharedList';
import Login from './pages/Login'; 
import Register from './pages/Register';
import Header from './components/Header'; 

// Componente de proteção de rota
const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();
  // Se estiver logado, renderiza o elemento, senão, redireciona para o login
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Header />
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shared/:hash" element={<SharedList />} />
          
          {/* ROTA PROTEGIDA */}
          <Route 
            path="/favorites" 
            element={<PrivateRoute element={<Favorites />} />} 
          />
          
          {/* Rota 404 (opcional) */}
          <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;