from rest_framework import serializers
from .models import FavoriteMovie

class FavoriteMovieSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo FavoriteMovie.
    Usado para converter objetos Python para JSON e validar dados de entrada.
    """
    class Meta:
        model = FavoriteMovie
        # IDs de filmes e dados que o Front-End precisa ver
        fields = [
            'id', 
            'tmdb_id', 
            'title', 
            'poster_path', 
            'rating', 
            'release_date', 
            'added_at'
        ]
        read_only_fields = ('added_at', 'id')