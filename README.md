# Verzel Elite Dev - Lista de Filmes Favoritos

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

## 🎬 Sobre

Aplicação *full-stack* (React + Django + PostgreSQL) para pesquisar filmes (via TMDb API), salvar favoritos e compartilhar listas. Desenvolvido para o desafio Elite Dev da Verzel.

## ✨ Funcionalidades

* Cadastro e Login de Usuários (JWT)
* Busca de Filmes (TMDb)
* Gerenciamento de Lista de Favoritos (CRUD por usuário)
* Compartilhamento de Lista via Link Único

## 🚀 Tecnologias

* **Front-End:** React, Axios, React Router DOM
* **Back-End:** Python, Django, Django REST Framework, SimpleJWT
* **Banco de Dados:** PostgreSQL
* **Configuração:** python-decouple, dj-database-url, django-cors-headers
* **Servidor WSGI (Prod):** Gunicorn
* **API Externa:** TMDb API
* **Hospedagem:** Render (API + DB), Vercel (Front-End)

## ☁️ Hospedagem (Deploy)

Esta aplicação está hospedada nas seguintes plataformas na nuvem:

* **API Back-End (Django):** **Render** (`Web Service`)
* **Banco de Dados (PostgreSQL):** **Render** (`Managed Database`)
* **Aplicação Front-End (React):** **Vercel** (ou Render `Static Site`)

**Acesse a aplicação:**

* **URL da Aplicação:** `[URL_DO_SEU_FRONTEND_NO_VERCEL]`
* **URL Base da API:** `[URL_DO_SEU_BACKEND_NO_RENDER]/api`

A comunicação entre o Front-End e o Back-End em produção é feita através da variável de ambiente `REACT_APP_DJANGO_API_BASE_URL` configurada na plataforma de hospedagem do Front-End (Vercel/Render).

## ⚙️ Configuração e Instalação Local (Opcional)

Siga os passos abaixo se desejar configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

* Python 3.10+ & Pip
* Node.js & Npm
* Git
* Servidor PostgreSQL local instalado e rodando.

### 1. Clonar o Repositório

```bash
git clone https://github.com/gabmfernandes/verzel-filmes-app
```

2. Configurar o Back-End (API Django)

# Navegue até a pasta backend
cd backend

# Crie e ative o ambiente virtual
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

Banco de Dados (PostgreSQL Local):

Crie um banco de dados (ex: elite_dev_db).

Tenha em mãos o usuário e senha do seu PostgreSQL local.

CREATE DATABASE elite_dev_db;

Arquivo .env (Back-End):

Na pasta /backend, crie um arquivo .env.

Preencha com suas credenciais locais e chave TMDb:

# /backend/.env
SECRET_KEY=sua-chave-secreta-aleatoria
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
TMDb_API_KEY=SUA_CHAVE_API_V3_DO_TMDB_AQUI
DB_ENGINE=django.db.backends.postgresql
DB_NAME=elite_dev_db
DB_USER=postgres # Ou seu usuário local
DB_PASSWORD=sua_senha_local
DB_HOST=localhost
DB_PORT=5432

Finalizar Setup Back-End:

# Aplique as migrações
python manage.py makemigrations
python manage.py migrate

# Crie um superusuário (opcional, para testes)
python manage.py createsuperuser

3. Configurar o Front-End (React App)

# Volte para a raiz e vá para a pasta frontend
cd ../frontend

# Instale as dependências
npm install

# Crie o arquivo .env.development na pasta /frontend
# Adicione a URL da API local:
#   REACT_APP_DJANGO_API_BASE_URL=http://localhost:8000/api

▶️ Rodar Localmente
Execute os comandos em dois terminais separados:

Terminal 1 (Back-End):

cd backend
# Ative o venv se necessário
python manage.py runserver

Terminal 2 (Front-End):

cd frontend
npm start

🤔 Decisões Chave de Arquitetura
Autenticação JWT: Implementada para garantir listas de favoritos seguras e separadas por usuário ("sua lista").

PostgreSQL: Escolhido pela robustez e adequação a ambientes de produção, comparado ao SQLite.

Separação Front-End/Back-End: Arquitetura desacoplada (API + SPA) para manutenibilidade e escalabilidade.