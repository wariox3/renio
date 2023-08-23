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

# Etapa 2: Servir la aplicación con Nginx
FROM nginx

EXPOSE 80

# Copia los archivos construidos al directorio de Nginx
COPY --from=builder /app/renio-metronic/dist/renio /usr/share/nginx/html

# Copia el archivo de configuración personalizado a /etc/nginx/conf.d/
COPY renio.conf /etc/nginx/conf.d/

# Crea el directorio sites-enabled y habilita el sitio con enlace simbólico
RUN mkdir -p /etc/nginx/sites-enabled/ && \
    ln -s /etc/nginx/conf.d/renio.conf /etc/nginx/sites-enabled/ && \
    nginx -t
