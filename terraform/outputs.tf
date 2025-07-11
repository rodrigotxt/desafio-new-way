# Saídas importantes após o deploy
output "frontend_url" {
  description = "URL do Application Load Balancer para o frontend"
  value       = "http://${aws_lb.main.dns_name}"
}

output "backend_api_url" {
  description = "URL do backend (se exposto via ALB)"
  # Isso é apenas um placeholder; o acesso ao backend deve ser preferencialmente interno.
  # Se o frontend chamar o backend usando o ALB, use a URL do ALB + caminho.
  value       = "http://${aws_lb.main.dns_name}:3000" # Exemplo, ajuste conforme sua regra de ALB
}

output "backend_ecr_repo_url" {
  description = "URL do repositório ECR do backend"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_repo_url" {
  description = "URL do repositório ECR do frontend"
  value       = aws_ecr_repository.frontend.repository_url
}

output "db_endpoint" {
  description = "Endpoint do banco de dados RDS"
  value       = aws_db_instance.main.address
  sensitive   = true
}