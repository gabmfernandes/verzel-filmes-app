import React, { useState, useEffect } from 'react';
import { getFavorites, removeFavorite, generateShareLink } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Componente simples para a lista de favoritos
const FavoriteItem = ({ movie, onRemove }) => (
    <div style={{ display: 'flex', border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
        <img src={`${TMDB_IMAGE_URL}${movie.poster_path}`} alt={movie.title} style={{ width: '80px', height: '120px', objectFit: 'cover', marginRight: '15px' }} />
        <div style={{ flexGrow: 1 }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{movie.title}</h3>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#00D1FF' }}>Nota: {
                    movie.rating 
                        ? parseFloat(movie.rating).toFixed(1) 
                        : 'N/A'
                }</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#555' }}>Adicionado em: {new Date(movie.added_at).toLocaleDateString()}</p>
        </div>
        <button onClick={() => onRemove(movie.tmdb_id)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#FF5733', color: 'white', border: 'none', borderRadius: '5px', height: 'fit-content' }}>
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

  

  useEffect(() => {
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
    loadFavorites();
  }, [isLoggedIn]);

  const handleRemove = async (tmdbId) => {
    try {
      await removeFavorite(tmdbId);
      setFavorites(favorites.filter(fav => fav.tmdb_id !== tmdbId));
    } catch (e) {
      alert('Erro ao remover o filme.');
    }
  };
  
  const handleGenerateLink = async () => {
    setShareLink('');
    try {
      const response = await generateShareLink();
      const hash = response.data.share_hash;
      const fullUrl = `${window.location.origin}/shared/${hash}`;
      setShareLink(fullUrl);
      
    } catch (e) {
      alert('Erro ao gerar link. Certifique-se de que a lista não está vazia.');
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copiado para a área de transferência!');
  };

  if (loading) return <p>Carregando favoritos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Meus Filmes Favoritos ({favorites.length})</h1>
      
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px dashed #00D1FF', borderRadius: '5px' }}>
          <h2>Compartilhar Lista</h2>
          <button 
              onClick={handleGenerateLink} 
              disabled={favorites.length === 0}
              style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#00D1FF', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}
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
          <p>Você não tem nenhum filme favorito salvo ainda.</p>
        )}
      </div>
    </div>
  );
}

export default Favorites;