from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    # URL GLOBAL DA API 
    path('api/', include('filmes_favoritos_api.urls')),
]
