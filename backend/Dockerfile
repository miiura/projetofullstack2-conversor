# Dockerfile do backend
FROM node:18-alpine

WORKDIR /app

# copia os arquivos de dependências
COPY package*.json ./

# instala as dependências (só produção pra economizar espaço)
RUN npm ci --only=production

# copia o código da aplicação
COPY . .

# expõe a porta do backend
EXPOSE 4000

# inicia o servidor
CMD ["npm", "start"]

