from django.urls import path
from .views import MovieSearchView, FavoriteListCreateView, FavoriteDestroyView

urlpatterns = [
    # Endpoint de Pesquisa
    path('search/', MovieSearchView.as_view(), name='movie-search'),

    # Gerenciamento da Lista (GET e POST)
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    
    # Remoção (DELETE)
    path('favorites/<int:tmdb_id>/', FavoriteDestroyView.as_view(), name='favorite-destroy'),
]