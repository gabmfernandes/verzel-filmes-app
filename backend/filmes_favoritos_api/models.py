from django.db import models
from django.contrib.auth.models import User
import uuid

# Armazena os dados essenciais de um filme favorito.
class FavoriteMovie(models.Model):
    """Representa um filme que foi salvo como favorito."""

    # Chave que liga ao usuário que favoritou
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    
    # ID do filme na API do TMDb.
    tmdb_id = models.IntegerField(unique=True) 
    
    # Título do filme
    title = models.CharField(max_length=255)
    
    # Campo para salvar a URL parcial da imagem do poster
    poster_path = models.CharField(max_length=255, blank=True, null=True)
    
    # Nota do TMDb
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    
    # Data de Lançamento
    release_date = models.DateField(null=True, blank=True)
    
    # Data em que o filme foi salvo
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('tmdb_id', 'user')

    def __str__(self):
        return self.title


# Representa a URL única de compartilhamento.
class ShareableList(models.Model):
    """
    Representa uma lista de filmes favoritos que pode ser compartilhada.
    """
    # Chave que liga a lista ao usuário que a gerou
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_lists')

    # O hash único que será usado na URL.
    share_hash = models.UUIDField(
        default=uuid.uuid4, 
        editable=False, 
        unique=True
    )
    
    # Uma lista pode ter muitos filmes, e um filme pode estar em várias listas 
    favorites = models.ManyToManyField(
        FavoriteMovie, 
        related_name='shared_lists'
    )
    
    # Data de criação da lista
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Lista Compartilhada {self.share_hash}"
