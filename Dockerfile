# Etapa 1: Construir la aplicación Angular
FROM node:14 as builder

WORKDIR /app

RUN git clone https://github.com/afcanop/renio-metronic.git .

# Instala las dependencias
RUN npm install --legacy-peer-deps

# Instala la CLI de Angular
RUN npm install -g @angular/cli

# Construye la aplicación Angular
RUN ng build --configuration=production --output-path=renio-metronic/dist/renio

# Etapa 2: Configurar el servidor Nginx
FROM nginx:latest

# Copia los archivos de la etapa anterior al directorio de trabajo del Nginx
COPY --from=builder /app/renio-metronic/dist/renio /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
