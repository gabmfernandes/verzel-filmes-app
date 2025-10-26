import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  // Redireciona se já estiver logado
//   if (isLoggedIn) {
//       navigate('/favorites');
//       return null;
//   }

  useEffect(() => {
    if (isLoggedIn) {
        navigate('/favorites');
    }
  }, [isLoggedIn, navigate]); // Dependências do hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      
    //   if (success) {
    //     // Redireciona para a rota protegida
    //     navigate('/favorites');
    //   }

    } catch (err) {
      // Erro 401 do JWT geralmente indica credenciais inválidas
      setError('Credenciais inválidas. Verifique seu nome de usuário e senha.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', width: '100%', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        
        <label style={{ marginBottom: '5px' }}>Nome de Usuário:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ marginBottom: '10px', padding: '8px' }}/>
        
        <label style={{ marginBottom: '5px' }}>Senha:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ marginBottom: '20px', padding: '8px' }}/>
        
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#00D1FF', color: 'white', border: 'none', borderRadius: '5px' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;