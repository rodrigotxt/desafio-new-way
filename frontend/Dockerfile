# Estágio de dependências
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Estágio de build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.local .env.local
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=development

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY ./public ./public

EXPOSE 3001

CMD ["npm", "start"]
