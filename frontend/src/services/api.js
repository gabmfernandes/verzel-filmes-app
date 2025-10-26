import axios from 'axios';

// 🚨 URL DO BACK-END DJANGO (certifique-se de que a porta 8000 está correta)
const BASE_URL = 'http://localhost:8000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
});

// =================================================================
// 1. INTERCEPTOR (Injeta o Token JWT em todas as requisições, exceto token/register)
// =================================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      // Adiciona o cabeçalho de autenticação Bearer
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// =================================================================
// 2. FUNÇÕES DE API (Serão usadas nos componentes)
// =================================================================

// Funções de Autenticação (NÃO usam o interceptor, pois ainda estão obtendo o token)
export const apiLogin = (username, password) => 
  axios.post(`${BASE_URL}/token/`, { username, password });
  
export const apiRegister = (data) =>
  axios.post(`${BASE_URL}/register/`, data);


// Funções do Core do Aplicativo (USAM o interceptor e o Token)

// A - Pesquisa TMDb
export const searchMovies = (query) => {
  // A requisição vai para /api/search/?query=...
  return api.get(`/search/`, { params: { query } });
};

// B - Gerenciamento de Favoritos (CRUD)
export const addFavorite = (movieData) => api.post('/favorites/', movieData);

export const getFavorites = () => api.get('/favorites/');

export const removeFavorite = (tmdbId) => api.delete(`/favorites/${tmdbId}/`);

// C - Compartilhamento
export const generateShareLink = () => api.post('/share/generate/');

export const getSharedList = (hash) => api.get(`/share/${hash}/`);


export default api;