# 🐳 Tutorial: Cómo Ejecutar el Proyecto con Docker

Este tutorial te guiará paso a paso para ejecutar el "Generador de Preguntas IA" utilizando Docker. Esto te permitirá tener todo el entorno (Backend, Frontend y Ollama) listo con un solo comando, sin instalar Node.js ni Ollama manualmente en tu sistema.

## 📋 Requisitos Previos

1.  **Tener Docker Desktop instalado y ejecutándose.**
    *   Si no lo tienes, descárgalo e instálalo desde [docker.com](https://www.docker.com/products/docker-desktop/).
    *   Asegúrate de que el icono de la ballena de Docker esté visible en tu barra de tareas.

## 🚀 Pasos para Ejecutar

### 1. Preparar el Entorno
Asegúrate de estar en la carpeta raíz del proyecto (`generador-preguntas-ia...`).

### 2. Construir y Levantar los Contenedores
Abre una terminal en la carpeta del proyecto y ejecuta el siguiente comando:

```bash
docker compose up --build
```

*   `up`: Levanta los servicios.
*   `--build`: Fuerza a reconstruir la imagen del backend (útil si has hecho cambios en el código).

**¿Qué pasará?**
*   Docker descargará la imagen de **Ollama** (puede tardar un poco la primera vez).
*   Docker construirá la imagen de tu **Backend** (instalará dependencias, etc.).
*   Verás logs de ambos servicios en la terminal.

### 3. Descargar el Modelo de IA (Solo la primera vez)
Una vez que veas que los servicios están corriendo (verás mensajes como `Listening on port 11434` para Ollama y `Servidor ejecutándose en puerto 3000` para la app), necesitas descargar el modelo `mistral` dentro del contenedor de Ollama.

Abre **otra terminal** (sin cerrar la anterior) y ejecuta:

```bash
docker exec -it generador-preguntas-ia--cristinamm-ibrahimma-ignaciomt--hito2-desarrollo-ia-ollama-1 ollama run mistral
```
*Nota: Si el nombre del contenedor es diferente, usa `docker ps` para ver el nombre exacto del contenedor de ollama.*

O una forma más genérica si el nombre varía:
```bash
docker compose exec ollama ollama run mistral
```

Espera a que termine de descargar y te deje en un prompt `>>>`. Puedes escribir "hola" para probar y luego salir con `/bye` o `Ctrl+D`.

### 4. ¡Usar la Aplicación!
Abre tu navegador y ve a:

👉 **http://localhost:3000**

*   Deberías ver la interfaz del Generador de Preguntas.
*   Prueba a generar preguntas. El backend se comunicará con el contenedor de Ollama automáticamente.

## 🛑 Cómo Detener Todo

Para detener los servicios, ve a la terminal donde ejecutaste `docker compose up` y presiona `Ctrl + C`.

Para eliminar los contenedores (pero mantener los datos de la BD y modelos), ejecuta:
```bash
docker compose down
```

## 🛠️ Solución de Problemas Comunes

*   **Error: "bind: address already in use"**: Significa que el puerto 3000 o 11434 ya está ocupado. Asegúrate de no tener otra instancia de la app o de Ollama corriendo en tu máquina local (fuera de Docker).
*   **Ollama no responde**: Asegúrate de haber ejecutado el paso 3 para descargar el modelo `mistral`. Sin el modelo, Ollama no puede generar nada.

## 📅 Guía Rápida para el Uso Diario

Una vez que ya has instalado todo y descargado el modelo (Pasos 1-3 anteriores), **cada vez que quieras volver a trabajar en el proyecto**, solo necesitas hacer esto:

1.  **Abrir la terminal** en la carpeta del proyecto.
2.  **Ejecutar el comando**:
    ```bash
    docker compose up
    ```
    *(No hace falta `--build` a menos que instales nuevas librerías)*.
3.  **Abrir el navegador** en `http://localhost:3000`.

¡Y listo! Docker se encarga de arrancar la base de datos, el backend y Ollama con el modelo que ya descargaste.

**Para terminar por hoy:**
*   Presiona `Ctrl + C` en la terminal para detenerlo.
