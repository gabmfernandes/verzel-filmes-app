import React, { useState, useEffect } from 'react';
import { searchMovies, addFavorite, getFavorites, removeFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const { isLoggedIn } = useAuth();
  
  const movieData = {
    tmdb_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    rating: parseFloat(movie.vote_average.toFixed(1)),
    release_date: movie.release_date,
  };

  console.log(movieData);

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', width: '220px', borderRadius: '8px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
      {movie.poster_path ? (
        <img src={`${TMDB_IMAGE_URL}${movie.poster_path}`} alt={movie.title} style={{ width: '100%', height: 'auto', borderRadius: '4px', marginBottom: '10px' }} />
      ) : (
        <div style={{ width: '100%', height: '330px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
          Sem Poster
        </div>
      )}
      
      <h3 style={{ fontSize: '1.1em', margin: '0 0 5px 0' }}>{movie.title}</h3>
      <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#00D1FF' }}>
        Nota: {movie.vote_average 
                        ? parseFloat(movie.vote_average).toFixed(1) 
                        : 'N/A'}
      </p>
      
      {isLoggedIn ? (
        <button 
          onClick={() => onToggleFavorite(movieData, isFavorite)}
          style={{ 
            padding: '8px', 
            width: '100%',
            cursor: 'pointer',
            backgroundColor: isFavorite ? '#FF5733' : '#00D1FF', 
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          {isFavorite ? 'Remover Favorito' : 'Adicionar Favorito'}
        </button>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '0.9em', color: '#888' }}>Faça login para favoritar.</p>
      )}
    </div>
  );
};


function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const { isLoggedIn } = useAuth();

  

  useEffect(() => {
    const loadFavorites = async () => {
        if (!isLoggedIn) {
        setFavoriteIds([]);
        return;
        }
        try {
        const response = await getFavorites();
        // Mapeia o resultado para obter apenas os tmdb_id
        setFavoriteIds(response.data.map(fav => fav.tmdb_id));
        } catch (e) {
        console.error("Não foi possível carregar favoritos:", e);
        }
    };

    loadFavorites();
  }, [isLoggedIn]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setMovies([]);

    try {
      const response = await searchMovies(searchTerm);
      setMovies(response.data); 
    } catch (err) {
      setError("Falha ao buscar filmes. Verifique o servidor Django e a API Key.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleFavorite = async (movieData, isFavorite) => {
    try {
      if (isFavorite) {
        await removeFavorite(movieData.tmdb_id);
        setFavoriteIds(prev => prev.filter(id => id !== movieData.tmdb_id));
        alert('Removido dos favoritos!');
      } else {
        await addFavorite(movieData);
        setFavoriteIds(prev => [...prev, movieData.tmdb_id]);
        alert('Adicionado aos favoritos!');
      }
    } catch (e) {
        alert('Erro ao gerenciar favoritos. Certifique-se de estar logado.');
        console.error("Erro no toggle:", e.response ? e.response.data : e);
    }
  };


  return (
    <div>
      <h1>Pesquisa de Filmes</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Digite o nome do filme..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#00D1FF', color: 'white', border: 'none', borderRadius: '5px' }} disabled={loading}>
          {loading ? 'Buscando...' : 'Pesquisar'}
        </button>
      </form>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {movies.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            isFavorite={favoriteIds.includes(movie.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
      
      {movies.length === 0 && !loading && searchTerm.trim() && <p style={{ textAlign: 'center' }}>Nenhum filme encontrado para "{searchTerm}".</p>}
    </div>
  );
}

export default Home;