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

# Etapa 2: Crear una imagen de Nginx con la configuración personalizada
FROM nginx

# Eliminamos la directiva que expone el puerto 80, ya que no es necesaria aquí

# Copia los archivos construidos al directorio de Nginx
COPY --from=builder /app/renio-metronic/dist/renio /usr/share/nginx/html

# Copia el archivo de configuración personalizado a /etc/nginx/sites-available/
COPY renio.conf /etc/nginx/sites-available/renio.conf

# Crear el directorio /etc/nginx/sites-enabled/
RUN mkdir -p /etc/nginx/sites-enabled/

# Crear un enlace simbólico para habilitar la configuración personalizada
RUN ln -s /etc/nginx/sites-available/renio.conf /etc/nginx/sites-enabled/

# Ejecuta nginx en primer plano para que no termine la ejecución del contenedor
CMD ["nginx", "-g", "daemon off;"]
