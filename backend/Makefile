# Makefile

DB_SERVICE = db 

.PHONY: up start stop restart down logs clean

# Inicia todos os serviços em segundo plano (detached mode)
up:
	@echo "Levantando os serviços Docker em segundo plano..."
	docker-compose up -d

# Inicia os serviços que já foram criados mas estão parados
start:
	@echo "Iniciando os serviços Docker..."
	docker-compose start

# Para os serviços, mas mantém os contêineres e volumes
stop:
	@echo "Parando os serviços Docker..."
	docker-compose stop

# Reinicia todos os serviços
restart:
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
	docker-compose down -v

# Mostra os logs de todos os serviços (ou de um serviço específico, como o DB)
logs:
	@echo "Mostrando os logs do serviço de banco de dados (${DB_SERVICE})..."
	docker-compose logs -f ${DB_SERVICE}

# logs-all:
# 	@echo "Mostrando os logs de TODOS os serviços..."
# 	docker-compose logs -f