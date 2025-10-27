# Verzel Elite Dev - Lista de Filmes Favoritos

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🎬 Sobre

Aplicação *full-stack* (React + Django + PostgreSQL) para pesquisar filmes (via TMDb API), salvar favoritos e compartilhar listas. Desenvolvido para o desafio **Elite Dev** da Verzel.

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

*(Substitua os placeholders acima pelas URLs reais após o deploy)*

A comunicação entre o Front-End e o Back-End em produção é feita através da variável de ambiente `REACT_APP_DJANGO_API_BASE_URL` configurada na plataforma de hospedagem do Front-End (Vercel/Render).

## ⚙️ Configuração e Instalação Local (Opcional)

Siga os passos abaixo se desejar configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

* Python 3.10+ & Pip  
* Node.js & Npm  
* Git  
* Servidor PostgreSQL local instalado e rodando

### 1. Clonar o Repositório

```bash
git clone https://github.com/gabmfernandes/verzel-filmes-app
cd verzel-filmes-app
```

### 2. Configurar o Back-End (API Django)

```bash
cd backend
python -m venv venv
# Ativar o ambiente virtual:
# No Windows:
venv\Scripts\activate
# No Linux/macOS:
source venv/bin/activate
pip install -r requirements.txt
```

**Banco de Dados (PostgreSQL Local):**

Certifique-se que o servidor PostgreSQL está rodando e crie o banco:

```sql
CREATE DATABASE elite_dev_db;
```

**Arquivo `.env` (Back-End):**

Crie o arquivo `/backend/.env`:

```ini
SECRET_KEY=sua-chave-secreta-aleatoria
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
TMDb_API_KEY=SUA_CHAVE_API_V3_DO_TMDB_AQUI
DB_ENGINE=django.db.backends.postgresql
DB_NAME=elite_dev_db
DB_USER=postgres
DB_PASSWORD=sua_senha_local
DB_HOST=localhost
DB_PORT=5432
```

**Finalizar Setup Back-End:**

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 3. Configurar o Front-End (React App)

```bash
cd ../frontend
npm install
```

**Arquivo `.env.development`:**

Crie `/frontend/.env.development`:

```ini
REACT_APP_DJANGO_API_BASE_URL=http://localhost:8000/api
```

### ▶️ Rodar Localmente

Execute em **dois terminais** separados:

**Terminal 1 (Back-End):**
```bash
cd backend
source venv/bin/activate  # ou venv\Scripts\activate
python manage.py runserver
```
(API rodando em http://localhost:8000)

**Terminal 2 (Front-End):**
```bash
cd frontend
npm start
```
(App rodando em http://localhost:3000)

Acesse **http://localhost:3000** no navegador.

## 🤔 Decisões Chave de Arquitetura

* **Autenticação JWT:** garante listas seguras e separadas por usuário.  
* **PostgreSQL:** robusto e adequado a ambientes produtivos.  
* **Arquitetura desacoplada (API + SPA):** facilita manutenção e escalabilidade.
