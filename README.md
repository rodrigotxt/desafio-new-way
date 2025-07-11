# Gerenciador de Tarefas: Backend (NestJS) e Frontend (Next.js)

Este projeto é uma aplicação completa de gerenciamento de tarefas, desenvolvida com um backend robusto em **NestJS** (TypeScript) e um frontend interativo em **Next.js** (React/TypeScript). Ele oferece funcionalidades de autenticação JWT, CRUD de tarefas com controle de acesso baseado em nível de usuário, e é totalmente conteinerizado usando **Docker Compose** para facilitar o desenvolvimento e o deploy.

**Direto ao ponto:**

- Clone o repositório
- Entre na pasta e faça `make up`
- Backend (Api/Swagger) `localhost:3000/api`
- Frontend (Next) `localhost:3001`
- Fazer seed no banco para criar usuário padrão `localhost:3000/seed`ou via swagger.
- Mais detalhes podem ser vistos nas seção **Como Subir o Projeto**

## 🚀 Funcionalidades

### **Backend (NestJS)**

* **Autenticação de Usuário:**
  * Login baseado em credenciais (username/password).
  * Geração e validação de tokens JWT (JSON Web Tokens) para acesso seguro.
* **Gerenciamento de Usuários:**
  * Criação de novos usuários (apenas via API, atualmente).
  * Listagem de usuários (com restrição de acesso).
* **Gerenciamento de Tarefas (CRUD):**
  * **Criação:** Usuários podem criar suas próprias tarefas; admins podem criar tarefas para qualquer usuário (com validação).
  * **Leitura:**
    * Usuários comuns veem apenas suas próprias tarefas.
    * Administradores veem todas as tarefas.
  * **Atualização:** Usuários podem atualizar suas próprias tarefas; administradores podem atualizar qualquer tarefa.
  * **Exclusão:** Usuários podem excluir suas próprias tarefas; administradores podem excluir qualquer tarefa.
* **Controle de Acesso:** Implementa guardas de autenticação e autorização para proteger rotas e recursos com base no token JWT e no nível de acesso do usuário (normal ou admin).
* **Validação de Dados:** Utiliza DTOs (Data Transfer Objects) e `ValidationPipe` para garantir a integridade dos dados de entrada.
* **Documentação Interativa (Swagger):** Fornece uma interface de usuário para explorar e testar todos os endpoints da API.

### **Frontend (Next.js)**

* **Página de Login:** Interface para autenticação de usuários.
* **Dashboard de Tarefas:**
  * Visualização da lista de tarefas.
  * Formulário para adicionar novas tarefas.
  * Funcionalidades de edição e exclusão para cada tarefa.
* **Navegação e Proteção de Rotas:** Redireciona usuários não autenticados para a tela de login e protege o acesso às páginas de tarefas.
* **Consumo de API:** Interage com o backend NestJS para todas as operações de dados.

## 🛠️ Tecnologias Utilizadas

* **Backend:**
  * NestJS (Framework Node.js)
  * TypeScript
  * JWT (JSON Web Tokens)
  * Passport.js (Estratégias de autenticação)
  * PostgreSQL (Banco de Dados)
  * TypeORM (ORM para interagir com o DB)
  * Swagger (Documentação da API)
* **Frontend:**
  * Next.js (Framework React)
  * React
  * TypeScript
* **Orquestração/Containerização:**
  * Docker
  * Docker Compose
* **Automação:**
  * Makefile

## ⚙️ Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

* **Docker Desktop:** Inclui Docker Engine e Docker Compose.
* **Node.js** e **npm** (ou Yarn) (necessário para executar comandos do projeto antes de conteinerizar ou para desenvolvimento sem Docker).
* **Git**

## 🚀 Como Subir o Projeto

Este projeto utiliza **Docker Compose** para gerenciar todos os serviços (banco de dados, backend e frontend), tornando o processo de inicialização muito simples.

1. **Clone o Repositório:**
   **Bash**

   ```
   git clone https://github.com/rodrigotxt/desafio-new-way.git
   cd desafio-new-way
   ```
2. **Crie os Arquivos de Variáveis de Ambiente:**

   * **Backend:** Crie um arquivo `.env`  ou renomei o `.env.example` na pasta `backend/`.
     **Snippet de código**

     ```
     # backend/.env
     DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/seu_banco"
     JWT_SECRET="sua_chave_secreta_jwt"
     # Outras variáveis que seu NestJS precisar...
     ```
   * **Frontend:** Crie um arquivo `.env.local` na pasta `frontend/`.
     **Snippet de código**

     ```
     # frontend/.env.local
     NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
     ```
   * Docker Compose: As variáveis de ambiente do banco de dados e do backend (como JWT\_SECRET) também serão definidas diretamente no docker-compose.yml. As do frontend serão passadas no Dockerfile.
     ATENÇÃO: Ajuste os valores de POSTGRES\_DB, POSTGRES\_USER, POSTGRES\_PASSWORD, DATABASE\_URL e JWT\_SECRET dentro do docker-compose.yml para corresponderem aos seus valores desejados e aos que seu backend espera.
3. Inicie os Serviços com Docker Compose:
   A partir da raiz do projeto (onde está o Makefile e docker-compose.yml), execute o comando:
   **Bash**

   ```
   make up
   ```

   Este comando irá:

   * Construir as imagens Docker para o backend e frontend (se ainda não existirem ou se houver alterações).
   * Criar e iniciar os contêineres para o banco de dados (PostgreSQL), backend (NestJS) e frontend (Next.js).
   * Os serviços rodarão em segundo plano.
4. **Acesse as Aplicações:**

   * **Frontend (Next.js):** Abra seu navegador e acesse `http://localhost:3001`
   * **Backend (NestJS API):** A API estará disponível em `http://localhost:3000`
   * **Documentação Swagger:** A documentação interativa da API estará em `http://localhost:3000/api`

## 📖 Documentação da API (Swagger)

A API do backend é documentada com **Swagger UI**, fornecendo uma interface interativa para explorar e testar os endpoints.

Para acessá-la, após subir o projeto, navegue para:

http://localhost:3000/api

### **Autenticação no Swagger:**

Para testar endpoints protegidos:

1. No Swagger UI, clique no botão **"Authorize"** no canto superior direito.
2. No campo `value` para `JWT-auth`, insira seu token JWT no formato `Bearer SEU_TOKEN_AQUI`.
   * Você pode obter um token fazendo uma requisição `POST` para `/auth/login` com as credenciais de um usuário existente.
3. Clique em "Authorize". O "cadeado" ao lado dos endpoints protegidos deverá aparecer fechado, indicando que o token será enviado nas suas requisições de teste.

## ⌨️ Comandos Úteis do Makefile

Para facilitar o gerenciamento dos serviços Docker:
_(os comandos abaixo funcionam para ambiente Linux, windows requer configuração adicional ou uso de WSL)_

* **`make up`**: Constrói as imagens (se necessário) e inicia todos os serviços em modo *detached* (segundo plano).
* **`make build`**: Apenas constrói as imagens Docker dos serviços.
* **`make start`**: Inicia os serviços que estão parados.
* **`make stop`**: Para os serviços (mantém os contêineres e volumes).
* **`make restart`**: Reinicia todos os serviços.
* **`make down`**: Para e remove os contêineres, redes e volumes (mas preserva o volume de dados do DB por padrão).
* **`make clean`**: **CUIDADO!** Para e remove os contêineres, redes **e todos os volumes de dados** (incluindo os dados do PostgreSQL). Use com cautela!
* **`make logs-all`**: Exibe os logs em tempo real de todos os serviços.
* **`make logs`**: Exibe os logs em tempo real do serviço de banco de dados (`db`).
* **`make logs-backend`**: Exibe os logs em tempo real do serviço de backend.
* **`make logs-frontend`**: Exibe os logs em tempo real do serviço de frontend.

Teste Técnico -  Desenvolvedor(a) Full Stack Sênior
