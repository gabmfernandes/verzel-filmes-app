import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 20px',
        backgroundColor: '#1E2837', // Cor escura para header
        color: 'white'
    }}>
      
      {/* Nome do App */}
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: '#00D1FF', textDecoration: 'none' }}>Verzel Filmes</Link>
      </h2>
      
      {/* Links de Navegação */}
      <nav style={{ display: 'flex', alignItems: 'center' }}>
        {isLoggedIn && (
          <Link to="/favorites" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
            Meus Favoritos
          </Link>
        )}
        
        {isLoggedIn ? (
          <button onClick={handleLogout} style={{ 
              padding: '8px 12px', 
              cursor: 'pointer',
              backgroundColor: '#FF5733', 
              color: 'white',
              border: 'none',
              borderRadius: '5px'
          }}>
            Logout
          </button>
        ) : (
          <div>
            <Link to="/login" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Cadastro
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;