# Dockerfile do frontend - build multi-stage
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# copia os arquivos de dependências
COPY package*.json ./

# instala as dependências
RUN npm ci

# copia o código da aplicação
COPY . .

# argumento pra URL da API (pode mudar no docker-compose)
ARG REACT_APP_API_URL=http://localhost:4000/api

# define a variável de ambiente pro build
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# builda a aplicação
RUN npm run build

# Stage 2: Produção
FROM nginx:alpine

# copia os arquivos buildados do stage anterior
COPY --from=builder /app/build /usr/share/nginx/html

# configura o nginx (importante pra SPA, senão dá 404 nas rotas)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# expõe a porta
EXPOSE 80

# inicia o nginx
CMD ["nginx", "-g", "daemon off;"]

