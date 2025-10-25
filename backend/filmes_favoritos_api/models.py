from django.db import models
import uuid

# Armazena os dados essenciais de um filme favorito.
class FavoriteMovie(models.Model):
    """Representa um filme que foi salvo como favorito."""
    
    # ID do filme na API do TMDb.
    tmdb_id = models.IntegerField(unique=True) 
    
    # Campos que vamos salvar para evitar chamadas extras ao TMDb
    title = models.CharField(max_length=255)
    
    # Campo para salvar a URL parcial da imagem do poster
    poster_path = models.CharField(max_length=255, blank=True, null=True)
    
    # Nota do TMDb. DecimalField é ideal para notas como 8.5
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    
    # Data de Lançamento (opcional)
    release_date = models.DateField(null=True, blank=True)
    
    # Data em que o filme foi salvo no nosso sistema
    added_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title


# Representa a URL única de compartilhamento.
class ShareableList(models.Model):
    """
    Representa uma lista de filmes favoritos que pode ser compartilhada.
    """
    
    # O hash/código único que será usado na URL.
    # uuid.uuid4 gera uma string única, perfeita para um link secreto.
    share_hash = models.UUIDField(
        default=uuid.uuid4, 
        editable=False, 
        unique=True
    )
    
    # Relacionamento M-N (Muitos-para-Muitos): 
    # Uma lista pode ter muitos filmes, e um filme pode estar em várias listas 
    # (embora no seu caso o filme só precisaria existir uma vez no BD).
    favorites = models.ManyToManyField(
        FavoriteMovie, 
        related_name='shared_lists'
    )
    
    # Data de criação da lista (útil para ordenação/auditoria)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Lista Compartilhada {self.share_hash}"
