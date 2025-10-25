from django.urls import path
from .views import (MovieSearchView, FavoriteListCreateView, 
                    FavoriteDestroyView, ShareLinkGenerateView, 
                    ShareLinkRetrieveView)

urlpatterns = [
    # Endpoint de Pesquisa
    path('search/', MovieSearchView.as_view(), name='movie-search'),

    # Gerenciamento da Lista (GET e POST)
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    
    # Remoção (DELETE)
    path('favorites/<int:tmdb_id>/', FavoriteDestroyView.as_view(), name='favorite-destroy'),

    # Geração do Link (POST)
    path('share/generate/', ShareLinkGenerateView.as_view(), name='share-link-generate'), 
    
    # Visualização do Link (GET)
    path('share/<uuid:share_hash>/', ShareLinkRetrieveView.as_view(), name='share-link-retrieve'),
]