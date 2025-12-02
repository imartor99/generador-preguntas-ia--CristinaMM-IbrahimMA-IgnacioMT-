# Usa una imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de paquetes del backend
COPY backend/package*.json ./backend/

# Instala las dependencias del backend
WORKDIR /app/backend
RUN npm install

# Copia el resto del código del backend
COPY backend/ ./

# Copia la carpeta frontend (necesaria porque el backend sirve los estáticos)
COPY frontend/ ../frontend/

# Crea el directorio db para la base de datos SQLite
RUN mkdir -p db

# Expone el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
