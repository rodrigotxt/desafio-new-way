# ./backend/Dockerfile
# Etapa de build (desenvolvimento)
FROM node:20-alpine AS builder

# Diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências (sem modificar lockfile)
RUN npm ci --omit=dev

# Copia o restante do código
COPY . .

# Compila o projeto (ex: NestJS → ./dist)
RUN npm run build


# Etapa de produção
FROM node:20-alpine

WORKDIR /app

# Copia apenas o necessário da imagem anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Porta padrão (ex: NestJS)
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/main"]
