# Usa la imagen base de Node.js
FROM node:20-slim

# Crea y establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package.json package-lock.json ./

# Instala las dependencias de Node.js (solo las de producción)
RUN npm install --omit=dev

# Copia el código fuente restante
COPY . .

# Comando de inicio del servidor (usa el script 'start' que definiste)
CMD ["npm", "start"]