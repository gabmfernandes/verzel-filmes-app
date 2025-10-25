from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from decouple import config
import requests
import json
import logging

logger = logging.getLogger(__name__)

# URL base da API do TMDb
TMDB_BASE_URL = 'https://api.themoviedb.org/3'
API_KEY = config('API_KEY')

class MovieSearchView(APIView):
    """View para pesquisar filmes na API do TMDb."""
    
    def get(self, request):
        # 1. Obter o termo de pesquisa (query) da URL (ex: ?query=Inception)
        search_query = request.query_params.get('query', None)
        
        if not search_query:
            return Response(
                {"detail": "O parâmetro 'query' é obrigatório para a pesquisa."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # 2. Construir o URL da API do TMDb
        url = f"{TMDB_BASE_URL}/search/movie"
        params = {
            'api_key': API_KEY,
            'query': search_query,
            'language': 'pt-BR' # Opcional: para resultados em português
        }
        
        try:
            # 3. Fazer a requisição HTTP externa
            response = requests.get(url, params=params)
            response.raise_for_status() # Lança exceção para códigos de erro (4xx ou 5xx)
            
            data = response.json()
            
            # 4. Retornar apenas os dados dos resultados
            return Response(data['results'], status=status.HTTP_200_OK)
            
        except requests.exceptions.HTTPError as e:
            logger.error(f"Erro HTTP ao chamar TMDb: {e}")
            return Response(
                {"detail": "Erro ao buscar filmes no TMDb. Verifique a chave da API."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.error(f"Erro inesperado: {e}")
            return Response(
                {"detail": "Erro interno do servidor."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )