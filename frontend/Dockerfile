# Stage 1: build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o template — será processado pelo envsubst no CMD
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

# envsubst substitui ${SERVER_NAME} e gera /etc/nginx/conf.d/default.conf
CMD ["/bin/sh", "-c", "envsubst '${SERVER_NAME}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
