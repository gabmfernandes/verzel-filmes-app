from django.urls import path
from .views import MovieSearchView
# FavoriteListCreateView, FavoriteDestroyView 
# Certifique-se de importar todas as Views, incluindo MovieSearchView

urlpatterns = [
    # Endpoint de Pesquisa
    path('search/', MovieSearchView.as_view(), name='movie-search'),
]