from rest_framework import serializers
from .models import FavoriteMovie, ShareableList
from django.contrib.auth.models import User

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

class ShareableListSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo ShareableList.
    Inclui os detalhes dos filmes favoritos relacionados.
    """

    favorites = FavoriteMovieSerializer(many=True, read_only=True)

    class Meta:
        model = ShareableList
        fields = ['share_hash', 'favorites', 'created_at']
        read_only_fields = ('share_hash', 'created_at')

class UserSerializer(serializers.ModelSerializer):
    """Serializer para registro de novo usuário."""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'email': {'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user