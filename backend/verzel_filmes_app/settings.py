import os
from pathlib import Path
from decouple import config
import dj_database_url
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool) # Lendo do .env ou ambiente

# ==============================================================================
# ALLOWED_HOSTS (CORREÇÃO PARA RENDER)
# ==============================================================================

# Lógica para suportar o domínio público do Render
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')

# Define a lista base: localhost e 127.0.0.1
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
]

# Adiciona o host externo do Render se estiver em produção
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# --- FIM da seção ALLOWED_HOSTS ---

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    'filmes_favoritos_api',
]

# ==============================================================================
# MIDDLEWARE (CORRIGIDO PARA CORS)
# ==============================================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'corsheaders.middleware.CorsMiddleware', 
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# --- FIM da seção MIDDLEWARE ---

# CORS
CORS_ALLOWED_ORIGINS = [
    # URLs de Desenvolvimento
    "http://localhost:3000",
    
    # URLs de Produção (Exemplo de Front-End em Vercel ou Render Static Site)
    "https://seu-app-de-filmes.vercel.app", 
]
CORS_ALLOW_CREDENTIALS = True


ROOT_URLCONF = "verzel_filmes_app.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "verzel_filmes_app.wsgi.application"


# ==============================================================================
# DATABASE (LÓGICA DE TRANSIÇÃO PARA RENDER/LOCAL)
# ==============================================================================

# 1. Tenta ler DATABASE_URL (definida pelo Render em produção)
DATABASE_URL = config('DATABASE_URL', default=None)

if DATABASE_URL:
    # MODO PRODUÇÃO: Usa a URL completa do Render
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600  
        )
    }
else:
    # MODO DESENVOLVIMENTO: Usa as variáveis separadas do local .env
    DATABASES = {
        "default": {
            # O ENGINE, NAME, USER, etc. agora precisam ser lidos do .env
            "ENGINE": config('DB_ENGINE', default='django.db.backends.sqlite3'),
            "NAME": config('DB_NAME', default=(BASE_DIR / 'db.sqlite3')),
            'USER': config('DB_USER', default=''),
            'PASSWORD': config('DB_PASSWORD', default=''),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default=''),
        }
    }
    
# --- FIM da seção DATABASES ---

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # Define o JWT como o principal método de autenticação da API
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        # Rejeita requisições se não estiver autenticado
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    )
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') # CRÍTICO PARA RENDER


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Configurações do JWT
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ROTATE_REFRESH_TOKENS": True,
}