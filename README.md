# Verzel Elite Dev - Lista de Filmes Favoritos

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🎬 Sobre o Projeto

Este projeto foi desenvolvido como parte do desafio técnico **Elite Dev** da Verzel. Trata-se de uma aplicação web *full-stack* que permite aos usuários:

1.  **Pesquisar filmes:** Utilizando a API pública do The Movie Database (TMDb).
2.  **Gerenciar uma lista de favoritos:** Usuários autenticados podem adicionar e remover filmes de sua lista pessoal.
3.  **Compartilhar a lista:** Gerar um link único e público para visualizar a lista de filmes favoritos.

A aplicação separa claramente o Front-End (interface do usuário) do Back-End (API e lógica de negócios), seguindo as melhores práticas de desenvolvimento web moderno.

## ✨ Funcionalidades Principais

* **Autenticação de Usuário:** Sistema de cadastro e login usando JWT (JSON Web Tokens) para garantir que cada usuário tenha sua própria lista de favoritos.
* **Busca de Filmes:** Integração com a API do TMDb para buscar filmes por título.
* **Lista de Favoritos:** CRUD (Create, Read, Delete) completo para a lista de filmes favoritos, associada ao usuário logado.
* **Compartilhamento:** Geração de um link único (baseado em UUID) que permite a visualização pública da lista de favoritos de um usuário.
* **Interface Responsiva (Básica):** Construída com React para uma experiência de usuário interativa.

## 🚀 Tecnologias Utilizadas

A escolha das tecnologias foi baseada nos requisitos do desafio e nas melhores práticas de desenvolvimento:

| Componente  | Tecnologia                | Porquê?                                                                                                                               |
| :---------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------ |
| Front-End   | **React** | Requisito do desafio. Excelente para criar interfaces de usuário interativas e componentizadas.                                       |
|             | `axios`                   | Para realizar requisições HTTP à API Back-End de forma simples e eficiente.                                                             |
|             | `react-router-dom`        | Para gerenciar o roteamento das páginas no Front-End (SPA - Single Page Application).                                                 |
| Back-End    | **Python + Django** | Opção permitida no desafio. Escolhido pela rapidez no desenvolvimento, ecossistema robusto e segurança integrada.                       |
|             | **Django REST Framework** | Framework padrão para construir APIs RESTful com Django, facilitando a serialização de dados e a implementação de endpoints seguros. |
| Autenticação| **JWT (SimpleJWT)** | Implementado para atender ao requisito implícito de "sua lista", garantindo a separação segura dos dados de cada usuário.               |
| Banco de Dados| **PostgreSQL** | Requisito permitia qualquer BD. Escolhido pela robustez, escalabilidade e por ser um padrão de mercado para aplicações Django.        |
| Configuração| `python-decouple`         | Para gerenciar variáveis de ambiente (chaves de API, segredos) de forma segura, separando a configuração do código.                 |
|             | `dj-database-url`         | Facilita a configuração da conexão com o banco de dados a partir de uma única URL, essencial para ambientes de deploy como o Render.  |
|             | `django-cors-headers`     | Para permitir que o Front-End (em `localhost:3000` ou Vercel) acesse a API Back-End (em `localhost:8000` ou Render) com segurança (CORS). |
| Servidor Web (Prod)| **Gunicorn** | Servidor WSGI padrão para rodar aplicações Python/Django em produção, exigido por plataformas como o Render.                     |
| API Externa | **TMDb API** | Requisito do desafio para obter dados e imagens de filmes.                                                                            |
| Hospedagem  | **Render** | Escolhido para hospedar tanto a **API Django** quanto o **Banco de Dados PostgreSQL**, oferecendo um plano gratuito e fácil integração. |
|             | **Vercel** (ou Render Static Site) | Escolhido para hospedar o **Front-End React**, otimizado para aplicações estáticas e com deploy simples via Git.                 |

## ⚙️ Configuração e Instalação Local

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

* **Python 3.10+** e **Pip**: [Instalar Python](https://www.python.org/)
* **Node.js e Npm**: [Instalar Node.js](https://nodejs.org/) (inclui Npm)
* **Git**: [Instalar Git](https://git-scm.com/)
* **PostgreSQL Server**: É necessário ter um servidor PostgreSQL rodando localmente. [Instalar PostgreSQL](https://www.postgresql.org/download/)

### 1. Clonar o Repositório

```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DA_PASTA_DO_PROJETO]

2. Configurar o Back-End (API Django)

# Navegue até a pasta do backend
cd backend

# Crie e ative um ambiente virtual
python -m venv venv
# No Windows: venv\Scripts\activate
# No Linux/macOS: source venv/bin/activate

# Instale as dependências Python
pip install -r requirements.txt

# Configure o Banco de Dados Local (PostgreSQL)
#   a. Crie um banco de dados (ex: 'elite_dev_db')
#   b. Crie um usuário e senha (ex: usuário 'postgres', senha 'suasenhaforte')
#   c. Conceda permissões ao usuário no banco de dados criado.
# Exemplo de comandos SQL (rode como superusuário no psql):
#   CREATE DATABASE elite_dev_db;
#   -- Se precisar de um usuário específico:
#   -- CREATE USER meu_usuario WITH PASSWORD 'minha_senha';
#   -- GRANT ALL PRIVILEGES ON DATABASE elite_dev_db TO meu_usuario;

# Crie o arquivo .env na raiz da pasta /backend
cp .env.example .env # Se você criar um .env.example
# Edite o arquivo /backend/.env com suas credenciais locais e a chave do TMDb:
#   SECRET_KEY=sua-chave-secreta-local
#   DEBUG=True
#   ALLOWED_HOSTS=localhost,127.0.0.1
#   TMDb_API_KEY=SUA_CHAVE_API_TMDB
#   DB_ENGINE=django.db.backends.postgresql
#   DB_NAME=elite_dev_db
#   DB_USER=postgres # Ou seu usuário criado
#   DB_PASSWORD=suasenhaforte # Ou sua senha criada
#   DB_HOST=localhost
#   DB_PORT=5432

# Aplique as migrações do banco de dados
python manage.py makemigrations
python manage.py migrate

# Crie um superusuário para o primeiro login e testes
python manage.py createsuperuser

3. Configurar o Front-End (React App)

# Navegue até a pasta do frontend (a partir da raiz do projeto)
cd ../frontend

# Instale as dependências Node.js
npm install

# Crie o arquivo .env.development na raiz da pasta /frontend
# Edite o arquivo /frontend/.env.development com a URL da API local:
#   REACT_APP_DJANGO_API_BASE_URL=http://localhost:8000/api

▶️ Rodando a Aplicação Localmente
Você precisará de dois terminais abertos:

Terminal 1 (Back-End):

cd backend
# Ative o venv se não estiver ativo
# source venv/bin/activate OU venv\Scripts\activate
python manage.py runserver
(A API estará rodando em http://localhost:8000)

Terminal 2 (Front-End):


cd frontend
npm start
(A aplicação React abrirá automaticamente em http://localhost:3000)

☁️ Hospedagem (Deploy)
Este projeto está configurado para ser hospedado nas seguintes plataformas:

API Back-End (Django): Hospedada no Render como um Serviço Web, utilizando Gunicorn.

Banco de Dados (PostgreSQL): Hospedado no Render como um serviço de Banco de Dados Gerenciado.

Aplicação Front-End (React): Hospedada no Vercel (ou Render Static Site), otimizada para aplicações estáticas.

A comunicação entre o Front-End e o Back-End em produção é feita através da variável de ambiente REACT_APP_DJANGO_API_BASE_URL configurada na plataforma de hospedagem do Front-End (Vercel/Render).

🤔 Decisões Chave de Arquitetura
Autenticação JWT: A escolha de implementar JWT foi feita para atender ao requisito de listas de favoritos por usuário ("sua lista") de forma segura e stateless, padrão em APIs modernas.

PostgreSQL em vez de SQLite: Embora SQLite fosse mais simples para desenvolvimento, PostgreSQL foi escolhido por ser um banco de dados robusto, mais adequado para produção e para demonstrar familiaridade com tecnologias de mercado.

Separação Front-End/Back-End: A arquitetura desacoplada facilita a manutenção, escalabilidade e permite que diferentes equipes (ou tecnologias) trabalhem em paralelo.