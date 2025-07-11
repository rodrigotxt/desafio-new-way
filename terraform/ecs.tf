# Cria um cluster ECS Fargate
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.project_name}-ecs-cluster"
  }
}

# ECR para imagens Docker
resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true # Permite deletar o repositório mesmo com imagens

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}-frontend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

# IAM Role para as tarefas ECS
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.project_name}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# IAM Role para o perfil da tarefa (se precisar acessar outros serviços AWS)
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.project_name}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

# Security Group para as tarefas ECS
resource "aws_security_group" "ecs_tasks" {
  name_prefix = "${var.project_name}-ecs-tasks-sg-"
  vpc_id      = aws_vpc.main.id

  # Regra de entrada para o backend (do load balancer ou frontend)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    security_groups = [aws_security_group.alb.id] # Permite acesso do ALB
  }

  # Regra de entrada para o frontend (do load balancer)
  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    security_groups = [aws_security_group.alb.id] # Permite acesso do ALB
  }

  # Regra de saída para permitir comunicação com o RDS e a internet
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ecs-tasks-sg"
  }
}

# Application Load Balancer (ALB)
resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  tags = {
    Name = "${var.project_name}-alb"
  }
}

resource "aws_security_group" "alb" {
  name_prefix = "${var.project_name}-alb-sg-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Acesso público HTTP
  }
  ingress {
    from_port   = 443 # Se usar HTTPS
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-alb-sg"
  }
}

# Target Group para o frontend
resource "aws_lb_target_group" "frontend" {
  name        = "${var.project_name}-tg-frontend"
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip" # Fargate usa IPs como targets

  health_check {
    path                = "/" # Ou um endpoint de saúde do seu frontend
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# Target Group para o backend (se você quiser expor a API diretamente via ALB)
resource "aws_lb_target_group" "backend" {
  name        = "${var.project_name}-tg-backend"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/health" # Um endpoint de saúde do seu backend
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# Listener do ALB na porta 80 (HTTP)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn # Roteia todo o tráfego para o frontend
  }
}
/*
# Opcional: Listener para o backend se quiser expor a API diretamente
resource "aws_lb_listener_rule" "backend_rule" {
  # Cuidado: Ajuste o path para não colidir com o frontend. Ex: /api/*
  # Você pode ter um path específico para o backend ou usar subdomínios.
  # Por simplicidade, não vou adicionar uma regra de backend aqui por padrão,
  # assumindo que o frontend faz as chamadas para o backend internamente.
  # Se precisar expor o backend, você pode adicionar algo como:
  # listener_arn = aws_lb_listener.http.arn
  # priority     = 100
  # action {
  #   type             = "forward"
  #   target_group_arn = aws_lb_target_group.backend.arn
  # }
  # condition {
  #   path_pattern {
  #     values = ["/api/*"]
  #   }
  # }
}
*/

# Definição da tarefa Backend
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-backend-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256" # 0.25 vCPU
  memory                   = "512" # 512 MB
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name        = "backend"
      image       = "${aws_ecr_repository.backend.repository_url}:latest"
      cpu         = 256
      memory      = 512
      essential   = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "DATABASE_URL"
          value = "postgres://${var.db_user}:${var.db_password}@${aws_db_instance.main.address}:5432/${var.db_name}"
        },
        {
          name  = "JWT_SECRET"
          value = var.jwt_secret
        },
        {
          name  = "NODE_ENV"
          value = "production"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.project_name}/backend"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  tags = {
    Name = "${var.project_name}-backend-task-def"
  }
}

# Definição da tarefa Frontend
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project_name}-frontend-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name        = "frontend"
      image       = "${aws_ecr_repository.frontend.repository_url}:latest"
      cpu         = 256
      memory      = 512
      essential   = true
      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NEXT_PUBLIC_API_BASE_URL"
          value = "http://${aws_lb.main.dns_name}:3000" # Ajustar se o backend for exposto de forma diferente
        },
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name = "PORT"
          value = "3001"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.project_name}/frontend"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  tags = {
    Name = "${var.project_name}-frontend-task-def"
  }
}

# Serviço ECS para o Backend
resource "aws_ecs_service" "backend" {
  name            = "${var.project_name}-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1 # Número de instâncias do backend
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.private[*].id # Backend em subnets privadas
    security_groups = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false # Não precisa de IP público, acessado internamente ou via ALB
  }

  # Se você quiser rotear tráfego externo para o backend
  /*
  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 3000
  }
  */

  # Adiciona uma dependência para garantir que o RDS esteja pronto
  depends_on = [aws_db_instance.main]

  tags = {
    Name = "${var.project_name}-backend-service"
  }
}

# Serviço ECS para o Frontend
resource "aws_ecs_service" "frontend" {
  name            = "${var.project_name}-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1 # Número de instâncias do frontend
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.public[*].id # Frontend em subnets públicas para acesso do ALB
    security_groups = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true # Atribuir IP público para tarefas em subnets públicas que precisam de internet (ex: pull de imagem)
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = 3001
  }

  tags = {
    Name = "${var.project_name}-frontend-service"
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "backend_log_group" {
  name              = "/ecs/${var.project_name}/backend"
  retention_in_days = 7 # Retenção de logs por 7 dias
}

resource "aws_cloudwatch_log_group" "frontend_log_group" {
  name              = "/ecs/${var.project_name}/frontend"
  retention_in_days = 7
}