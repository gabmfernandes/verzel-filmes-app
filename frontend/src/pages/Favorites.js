import React, { useState, useEffect } from 'react';
import { getFavorites, removeFavorite, generateShareLink } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext'; // Importe o Contexto de Notificação

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Componente simples para a lista de favoritos
const FavoriteItem = ({ movie, onRemove }) => (
    <div style={{ display: 'flex', border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
        <img src={`${TMDB_IMAGE_URL}${movie.poster_path}`} alt={movie.title} style={{ width: '80px', height: '120px', objectFit: 'cover', marginRight: '15px' }} />
        <div style={{ flexGrow: 1 }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{movie.title}</h3>
            
            {/* 🚨 CORREÇÃO DE EXIBIÇÃO: Converte a string para float e formata */}
            <p style={{ margin: 0, fontWeight: 'bold', color: '#00D1FF' }}>
                Nota: {
                    // Checa se o valor existe e se é um número (lidando com strings de DecimalField ou null)
                    (movie.rating !== null && movie.rating !== undefined && !isNaN(parseFloat(movie.rating))) 
                        ? parseFloat(movie.rating).toFixed(1) 
                        : 'N/A'
                }
            </p>
            
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#555' }}>
                Adicionado em: {new Date(movie.added_at).toLocaleDateString()}
            </p>
        </div>
        <button 
            onClick={() => onRemove(movie.tmdb_id)} 
            style={{ 
                padding: '8px 12px', 
                cursor: 'pointer', 
                backgroundColor: '#FF5733', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                height: 'fit-content' 
            }}
        >
            Remover
        </button>
    </div>
);


function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState('');
  const [error, setError] = useState(null);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // Use o hook de notificação

  const loadFavorites = async () => {
    if (!isLoggedIn) {
        navigate('/login');
        return;
    }
    try {
      setLoading(true);
      const response = await getFavorites();
      setFavorites(response.data);
    } catch (e) {
      setError('Falha ao carregar lista. Seu token pode ter expirado.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [isLoggedIn, navigate]); // Adicionado 'navigate' para evitar warning

  const handleRemove = async (tmdbId) => {
    try {
      await removeFavorite(tmdbId);
      // Atualiza o estado removendo o filme deletado
      setFavorites(favorites.filter(fav => fav.tmdb_id !== tmdbId));
      showNotification('Filme removido dos favoritos!', 'info');
    } catch (e) {
      showNotification('Erro ao remover o filme.', 'error');
    }
  };
  
  const handleGenerateLink = async () => {
    setShareLink('');
    try {
      const response = await generateShareLink();
      const hash = response.data.share_hash;
      // Constrói o link completo usando a URL do Front-End
      const fullUrl = `${window.location.origin}/shared/${hash}`;
      setShareLink(fullUrl);
      showNotification('Link gerado com sucesso!', 'success');
      
    } catch (e) {
      showNotification('Erro ao gerar link. A lista pode estar vazia ou o servidor falhou.', 'error');
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    showNotification('Link copiado para a área de transferência!', 'info');
  };

  // 🚨 NOVO: Função para navegar para a página de pesquisa
  const handleGoToSearch = () => {
    navigate('/');
  };


  if (loading) return <p>Carregando favoritos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Meus Filmes Favoritos ({favorites.length})</h1>
      
      {/* 🚨 NOVO BLOCO: Botão de adicionar filme */}
      <div style={{ 
          marginBottom: '20px', 
          textAlign: 'left', 
          borderBottom: '1px solid #eee', 
          paddingBottom: '15px' 
      }}>
          <button 
              onClick={handleGoToSearch}
              style={{ 
                  padding: '10px 15px', 
                  cursor: 'pointer', 
                  backgroundColor: '#3498db', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px' 
              }}
          >
              + Adicionar Novo Filme
          </button>
      </div>
      
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px dashed #00D1FF', borderRadius: '5px' }}>
          <h2>Compartilhar Lista</h2>
          <button 
              onClick={handleGenerateLink} 
              disabled={favorites.length === 0}
              style={{ 
                  padding: '10px 15px', 
                  cursor: 'pointer', 
                  backgroundColor: favorites.length === 0 ? '#aaa' : '#00D1FF', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  marginRight: '10px' 
              }}
          >
              Gerar Link de Compartilhamento
          </button>
          
          {shareLink && (
              <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}>
                  <input type="text" value={shareLink} readOnly style={{ padding: '8px', flexGrow: 1, marginRight: '10px' }} />
                  <button onClick={handleCopy} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>
                      Copiar
                  </button>
              </div>
          )}
          {favorites.length === 0 && <p style={{ color: '#888', marginTop: '10px' }}>Adicione filmes para compartilhar.</p>}
      </div>

      <div style={{ maxWidth: '600px' }}>
        {favorites.length > 0 ? (
          favorites.map(movie => (
            <FavoriteItem key={movie.id} movie={movie} onRemove={handleRemove} />
          ))
        ) : (
          /* Exibe um CTA (Call to Action) se a lista estiver vazia */
          <div style={{ textAlign: 'center', padding: '50px', border: '1px solid #eee', borderRadius: '5px' }}>
              <p>Sua lista está vazia! Adicione o primeiro filme agora:</p>
              <button 
                  onClick={handleGoToSearch}
                  style={{ 
                      padding: '12px 20px', 
                      cursor: 'pointer', 
                      backgroundColor: '#27ae60', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px',
                      fontSize: '1.1em'
                  }}
              >
                  Começar a Pesquisar Filmes
              </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;