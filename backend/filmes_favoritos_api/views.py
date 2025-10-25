from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import FavoriteMovie, ShareableList
from .serializers import FavoriteMovieSerializer, ShareableListSerializer, UserSerializer

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
    GET: Retorna a lista de filmes favoritos DO USUÁRIO LOGADO.
    POST: Adiciona um novo filme à lista do USUÁRIO LOGADO.
    """
    permission_classes = [IsAuthenticated]  # IMPEDE ACESSO SEM TOKEN

    def get(self, request):
        # Obtém APENAS os favoritos do usuário logado
        favorites = FavoriteMovie.objects.filter(user=request.user).order_by('-added_at')
        
        serializer = FavoriteMovieSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FavoriteMovieSerializer(data=request.data)
        
        if serializer.is_valid():
            tmdb_id = serializer.validated_data.get('tmdb_id')
            
            # Verifica se o filme já existe PARA ESTE USUÁRIO
            if FavoriteMovie.objects.filter(tmdb_id=tmdb_id, user=request.user).exists():
                return Response(
                    {"detail": "Este filme já está na sua lista de favoritos."},
                    status=status.HTTP_409_CONFLICT
                )
            
            # Salva o filme e liga-o ao usuário logado
            serializer.save(user=request.user) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FavoriteDestroyView(APIView):
    """
    DELETE: Remove um filme favorito do usuário logado.
    """
    permission_classes = [IsAuthenticated]  # IMPEDE ACESSO SEM TOKEN
    
    def delete(self, request, tmdb_id):
        user = request.user 
        
        try:
            # Busca o filme pelo tmdb_id E pelo user logado.
            favorite = FavoriteMovie.objects.get(
                tmdb_id=tmdb_id,
                user=user
            )
            
        except FavoriteMovie.DoesNotExist:
            # Retorna 404 se o filme não for encontrado OU se não pertencer ao usuário
            return Response(
                {"detail": "Filme não encontrado na sua lista."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ShareLinkGenerateView(APIView):
    """
    POST: Gera um novo hash de compartilhamento para a lista de favoritos DO USUÁRIO.
    """
    permission_classes = [IsAuthenticated] # IMPEDE ACESSO SEM TOKEN
    
    def post(self, request):
        # 1. Obtém APENAS os favoritos do usuário logado
        favorites = FavoriteMovie.objects.filter(user=request.user)
        
        if not favorites.exists():
            return Response(
                {"detail": "Não é possível gerar um link: sua lista de favoritos está vazia."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # 2. Cria o objeto ShareableList e liga-o ao usuário
        # O modelo ShareableList agora exige o campo 'user'
        new_list = ShareableList.objects.create(user=request.user) 
        
        # 3. Adiciona os filmes filtrados ao M2M
        new_list.favorites.set(favorites)
        
        return Response(
            {"share_hash": new_list.share_hash},
            status=status.HTTP_201_CREATED
        )


class ShareLinkRetrieveView(APIView):
    """
    GET: Retorna os detalhes da lista de filmes a partir do hash de compartilhamento.
    """
    def get(self, request, share_hash):
        try:
            # 1. Busca a lista pelo hash (UUID) passado na URL
            shared_list = ShareableList.objects.get(share_hash=share_hash)
            
        except ShareableList.DoesNotExist:
            return Response(
                {"detail": "Link de compartilhamento inválido ou expirado."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        # 2. Serializa a lista, incluindo todos os filmes relacionados
        serializer = ShareableListSerializer(shared_list)
        
        # 3. Retorna a lista de filmes
        return Response(serializer.data)
    
class RegisterView(APIView):
    """Endpoint para cadastro de novos usuários."""
    # Permite que usuários não autenticados (qualquer um) acessem este endpoint
    permission_classes = [AllowAny] 
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Usuário registrado com sucesso."},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)