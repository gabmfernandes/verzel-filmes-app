from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Rotas de Autenticação JWT (Login/Refresh)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Envia user/pass, recebe token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Renova o token

    # URL GLOBAL DA API 
    path('api/', include('filmes_favoritos_api.urls')),
]
