import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; 
// Importe a folha de estilo padrão do React se ela existir
import './index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Envolvemos o App no Provedor de Autenticação */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);