import React, { useState } from 'react';
import { apiRegister } from '../services/api'; // Usa a função do service
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await apiRegister({ username, email, password });
      
      alert('Cadastro realizado com sucesso! Faça o login.');
      navigate('/login');

    } catch (err) {
      // Trata erros de validação do Django
      const data = err.response?.data;
      let errorMsg = 'Erro desconhecido no cadastro.';
      
      if (data) {
        // Pega a primeira mensagem de erro de qualquer campo (username, email, password)
        errorMsg = data.username ? `Usuário: ${data.username[0]}` : 
                   data.email ? `Email: ${data.email[0]}` : 
                   data.password ? `Senha: ${data.password[0]}` : errorMsg;
      }
      setError(errorMsg);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Cadastrar</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', width: '100%', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        
        <label style={{ marginBottom: '5px' }}>Nome de Usuário:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ marginBottom: '10px', padding: '8px' }}/>
        
        <label style={{ marginBottom: '5px' }}>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: '10px', padding: '8px' }}/>
        
        <label style={{ marginBottom: '5px' }}>Senha:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ marginBottom: '20px', padding: '8px' }}/>
        
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#00D1FF', color: 'white', border: 'none', borderRadius: '5px' }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Register;