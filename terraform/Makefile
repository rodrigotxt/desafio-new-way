DB_PASSWORD ?=a1b2c3
JWT_SECRET ?=tDW6bSlYfmBF8irvWkgxZF1q4x53f0pW

# Flag para auto-approve no apply
AUTO_APPROVE ?= false

# Argumentos base para o Terraform, incluindo os -var
TERRAFORM_ARGS = $(if $(DB_PASSWORD),-var="db_password=$(DB_PASSWORD)") \
                 $(if $(JWT_SECRET),-var="jwt_secret=$(JWT_SECRET)")

.PHONY: init plan apply destroy clean

# Inicializa o Terraform
init:
	@echo "🔥 Inicializando o Terraform..."
	terraform init

# Cria um plano de execução do Terraform
# Uso: make plan [DB_PASSWORD=sua_senha] [JWT_SECRET=seu_segredo]
plan: init
	@echo "📝 Gerando plano de execução do Terraform..."
	terraform plan $(TERRAFORM_ARGS)

# Aplica as mudanças do Terraform
# Uso: make apply [DB_PASSWORD=sua_senha] [JWT_SECRET=seu_segredo] [AUTO_APPROVE=true]
apply: init
	@echo "🚀 Aplicando mudanças do Terraform..."
	$(if $(filter true,$(AUTO_APPROVE)),terraform apply --auto-approve $(TERRAFORM_ARGS),terraform apply $(TERRAFORM_ARGS))

# Destroi os recursos do Terraform
# Uso: make destroy [DB_PASSWORD=sua_senha] [JWT_SECRET=seu_segredo] [AUTO_APPROVE=true]
destroy: init
	@echo "💥 Destruindo recursos do Terraform..."
	$(if $(filter true,$(AUTO_APPROVE)),terraform destroy --auto-approve $(TERRAFORM_ARGS),terraform destroy $(TERRAFORM_ARGS))

# Limpa o ambiente local do Terraform (útil para começar do zero)
clean:
	@echo "🧹 Limpando arquivos temporários do Terraform..."
	rm -rf .terraform/ .terraform.lock.hcl terraform.tfstate*