import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedList } from '../services/api';

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const SharedMovieCard = ({ movie }) => (
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
        Nota TMDB: {
            movie.rating 
                ? parseFloat(movie.rating).toFixed(1) 
                : 'N/A'
        }
      </p>
    </div>
);


function SharedList() {
  const { hash } = useParams();
  const [sharedData, setSharedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedList = async () => {
      try {
        const response = await getSharedList(hash);
        setSharedData(response.data);
      } catch (e) {
        setError('Não foi possível carregar a lista compartilhada. O link pode ser inválido.');
      } finally {
        setLoading(false);
      }
    };
    
    if (hash) {
      loadSharedList();
    } else {
        setLoading(false);
        setError('Nenhum código de compartilhamento fornecido.');
    }
  }, [hash]);

  if (loading) return <p>Carregando lista compartilhada...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!sharedData) return <p>Lista não encontrada.</p>;
  
  return (
    <div>
      <h1 style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        Lista Compartilhada
      </h1>
      <p style={{ fontSize: '0.9em', color: '#555' }}>
          Criada em: {new Date(sharedData.created_at).toLocaleDateString()}
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>
        {sharedData.favorites.map(movie => (
          <SharedMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      {sharedData.favorites.length === 0 && <p>Esta lista está vazia.</p>}
    </div>
  );
}

export default SharedList;