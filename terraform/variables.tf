# Variáveis de entrada
variable "aws_region" {
  description = "A região da AWS para o deploy"
  type        = string
  default     = "us-east-1" # Altere para a região desejada
}

variable "project_name" {
  description = "Nome do projeto, usado como prefixo para recursos"
  type        = string
  default     = "tasks-app"
}

variable "db_name" {
  description = "Nome do banco de dados PostgreSQL"
  type        = string
  default     = "tasks_db"
}

variable "db_user" {
  description = "Usuário do banco de dados PostgreSQL"
  type        = string
  default     = "postgres_user"
}

variable "db_password" {
  description = "Senha do banco de dados PostgreSQL"
  type        = string
  sensitive   = true # Marca como sensível para não exibir em logs
}

variable "jwt_secret" {
  description = "Segredo JWT para o backend"
  type        = string
  sensitive   = true
}

variable "vpc_cidr_block" {
  description = "Bloco CIDR para a VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Lista de blocos CIDR para as subnets públicas"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Lista de blocos CIDR para as subnets privadas"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}