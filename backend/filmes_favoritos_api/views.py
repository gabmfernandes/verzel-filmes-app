from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FavoriteMovie
from .serializers import FavoriteMovieSerializer

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
        # 1. Obter o termo de pesquisa (query) da URL
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
            'language': 'pt-BR'
        }
        
        try:
            # 3. Fazer a requisição HTTP externa
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
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
        
class FavoriteListCreateView(APIView):
    """
    GET: Retorna a lista completa de filmes favoritos.
    POST: Adiciona um novo filme à lista de favoritos.
    """
    
    def get(self, request):
        # 1. Recupera todos os filmes e ordena por data de adição (mais recente primeiro)
        favorites = FavoriteMovie.objects.all().order_by('-added_at')
        
        # 2. Serializa a lista para JSON (many=True para uma lista de objetos)
        serializer = FavoriteMovieSerializer(favorites, many=True)
        
        # 3. Retorna a lista com status 200 OK
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # 1. Instancia o Serializer com os dados recebidos do POST
        serializer = FavoriteMovieSerializer(data=request.data)
        
        if serializer.is_valid():
            # 2. Lógica para EVITAR DUPLICIDADE:
            tmdb_id = serializer.validated_data.get('tmdb_id')
            if FavoriteMovie.objects.filter(tmdb_id=tmdb_id).exists():
                return Response(
                    {"detail": "Este filme já está na sua lista de favoritos."},
                    status=status.HTTP_409_CONFLICT # 409: Conflito (já existe)
                )
            
            # 3. Salva o novo filme no banco de dados
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) # 201: Criado
        
        # Retorna erros de validação
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FavoriteDestroyView(APIView):
    """
    DELETE: Remove um filme favorito usando o ID do TMDb passado na URL.
    """
    def delete(self, request, tmdb_id):
        try:
            # 1. Tenta encontrar o filme no BD pelo tmdb_id (chave única)
            favorite = FavoriteMovie.objects.get(tmdb_id=tmdb_id)
            
        except FavoriteMovie.DoesNotExist:
            return Response(
                {"detail": "Filme não encontrado na lista de favoritos."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        # 2. Deleta o objeto encontrado
        favorite.delete()
        
        # 3. Retorna 204 No Content (padrão para sucesso em DELETE)
        return Response(status=status.HTTP_204_NO_CONTENT)