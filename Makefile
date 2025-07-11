# Makefile

# Variáveis
DB_SERVICE = db
BACKEND_SERVICE = backend
FRONTEND_SERVICE = frontend

.PHONY: up start stop restart down logs logs-backend logs-frontend clean build setup-env

# Comando para configurar os arquivos .env
setup-env:
	@echo "Configurando arquivos .env..."
	@if [ ! -f ./backend/.env ]; then cp ./backend/.env.example ./backend/.env; echo "Criado ./backend/.env"; fi
	@if [ ! -f ./frontend/.env.local ]; then cp ./frontend/.env.local.example ./frontend/.env.local; echo "Criado ./frontend/.env.local"; fi
	@echo "Verifique e ajuste os arquivos .env criados com suas configurações."

# Constrói (ou reconstrói) as imagens Docker dos serviços
build: setup-env
	@echo "Construindo as imagens Docker..."
	docker-compose build

# Inicia todos os serviços em segundo plano (detached mode) e constrói se as imagens não existirem
up: build
	@echo "Levantando os serviços Docker em segundo plano..."
	docker-compose up -d

# Inicia os serviços que já foram criados mas estão parados
start: setup-env
	@echo "Iniciando os serviços Docker..."
	docker-compose start

# Para os serviços, mas mantém os contêineres e volumes
stop:
	@echo "Parando os serviços Docker..."
	docker-compose stop

# Reinicia todos os serviços
restart: setup-env
	@echo "Reiniciando os serviços Docker..."
	docker-compose restart

# Para e remove os contêineres, redes e volumes (cuidado: apaga os dados do DB se o volume não for removido separadamente)
# Use 'down -v' para remover também os volumes (ex: dados do PostgreSQL)
down:
	@echo "Derrubando os serviços Docker..."
	docker-compose down

# Derruba os serviços e remove os volumes de dados do PostgreSQL
clean:
	@echo "Derrubando os serviços Docker e removendo volumes de dados (CUIDADO: APAGA OS DADOS DO BANCO DE DADOS!)..."
	docker-compose down -v --remove-orphans

# Mostra os logs de um serviço específico (DB, backend, frontend)
logs:
	@echo "Mostrando os logs do serviço de banco de dados (${DB_SERVICE})..."
	docker-compose logs -f ${DB_SERVICE}

logs-backend:
	@echo "Mostrando os logs do serviço de backend (${BACKEND_SERVICE})..."
	docker-compose logs -f ${BACKEND_SERVICE}

logs-frontend:
	@echo "Mostrando os logs do serviço de frontend (${FRONTEND_SERVICE})..."
	docker-compose logs -f ${FRONTEND_SERVICE}

# Mostra os logs de TODOS os serviços
logs-all:
	@echo "Mostrando os logs de TODOS os serviços..."
	docker-compose logs -f