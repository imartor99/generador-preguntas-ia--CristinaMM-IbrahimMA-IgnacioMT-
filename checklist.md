## ✅ Checklist del Proyecto "Generador de Preguntas Inteligente"

| Paso | Tarea | Responsable | Estado |
| :--- | :--- | :--- | :---: |
| **1. Configuración Inicial del Proyecto** | | | |
| **1.1 Inicialización (Común)** | | | |
| ☐ Crear carpeta `generador-preguntas-ia-[tu-nombre-iniciales]` | | Común | ✅ |
| ☐ Inicializar repositorio Git (`git init`) | | Común | ✅ |
| ☐ Crear rama de trabajo (`git checkout -b hito2/desarrollo-ia`) | | Común | ✅ |
| **1.2 Backend - Dependencias** | | **Nacho** | ✅ |
| ☐ Crear la carpeta `backend/` | | Nacho | ✅ |
| ☐ Crear `package.json` en `backend/` y completar datos | | Nacho | ✅ |
| ☐ Instalar dependencias: `npm install express dotenv better-sqlite3 cors` | | Nacho | ✅ |
| ☐ Instalar dependencias de desarrollo: `npm install --save-dev nodemon` | | Nacho | ✅ |
| ☐ Añadir `"type": "module"` a `package.json` | | Nacho | ✅ |
| ☐ Configurar *scripts* `dev` y `start` en `package.json` | | Nacho | ✅ |
| **1.3 Archivos de Configuración** | | **Cristina** | |
| ☐ Crear `.env` y `.env.example` en la raíz del proyecto | | Cristina | ✅ |
| ☐ Crear `.gitignore` en la raíz (excluir `.env`, `node_modules`, `preguntas.db`) | | Cristina | ✅ |
| **1.4 Frontend - Estructura Básica** | | **Cristina** | |
| ☐ Crear carpeta `frontend/` | | Cristina | ✅ |
| ☐ Crear `frontend/index.html` (estructura básica con `<div id="app">`) | | Cristina | ✅ |
| ☐ Crear `frontend/style.css` y `frontend/main.js` vacíos | | Cristina | ✅ |
| ☐ Linkar `style.css` y `main.js` en `index.html` | | Cristina | ✅ |
| **2. Backend - Implementación** | | | |
| **2.1 Base de Datos** | | **Ibra** | |
| ☐ Crear carpeta `backend/db/` | | Ibra | ✅ |
| ☐ Implementar `backend/db.js` para inicializar SQLite3 y generar las tablas automáticamente | | Ibra | ✅ |
| **2.2 Temas y Prompts** | | **Ibra** | |
| ☐ Implementar `backend/prompts.js` con 3 o 4 temas, incluyendo `id`, `nombre`, `descripcion` y el `prompt` (con placeholders) | | Ibra | ✅ |
| **2.3 Lógica Principal (*Services*)** | | **Ibra** | |
| ☐ Implementar `backend/services.js` (Archivo más importante) | | Ibra | ✅ |
| ☐ Función `generarPreguntas`: Incluye conexión a Ollama (POST a `/api/generate`), parseo JSON y guardado en BD | | Ibra | ✅ |
| ☐ Función `obtenerPreguntas(tema)`: Buscar en BD preguntas del tema | | Ibra | ✅ |
| ☐ Función `eliminarPregunta(id)`: Eliminar de BD por ID | | Ibra | ✅ |
| ☐ Función `limpiarTema(tema)`: Eliminar todas las preguntas de un tema | | Ibra | ✅ |
| ☐ Manejo de errores: Si Ollama no responde y *Timeout* (> 60s) | | Ibra | ✅ |
| **2.4 Endpoints de la API (*Routes*)** | | **Nacho** | |
| ☐ Implementar `backend/routes.js` e importar Express Router | | Nacho | ✅ |
| ☐ `POST /api/generate` | | Nacho | ✅ |
| ☐ `GET /api/preguntas` (con query param `?tema` opcional) | | Nacho | ✅ |
| ☐ `GET /api/preguntas/:id` | | Nacho | ✅ |
| ☐ `DELETE /api/preguntas/:id` | | Nacho | ✅ |
| ☐ `DELETE /api/preguntas/tema/:tema` | | Nacho | ✅ |
| ☐ `GET /api/temas` | | Nacho | ✅ |
| ☐ `GET /api/health` (Estado servidor y Ollama) | | Nacho | ✅ |
| ☐ Asegurar Validación de entrada, `try-catch` y códigos HTTP adecuados | | Nacho | ✅ |
| **2.5 Servidor Express (*Server*)** | | **Nacho** | |
| ☐ Implementar `backend/server.js` (cargar `.env`, configurar CORS, montar rutas en `/api`, servir estáticos) | | Nacho | ✅ |
| **3. Frontend - JavaScript Vanilla** | | | |
| **3.1 Estructura HTML** | | **Cristina** | |
| ☐ Completar `frontend/index.html` con selector de tema, inputs, botones, contenedor, carga | | Cristina | ✅ |
| **3.2 Estilos CSS** | | **Cristina** | |
| ☐ Implementar `frontend/style.css` (CSS vanilla, responsive, estilos para tarjetas, carga, error) | | Cristina | ✅ |
| **3.3 Lógica JavaScript** | | **Cristina** | |
| ☐ Implementar `frontend/main.js` | | Cristina | ✅ |
| ☐ Función `cargarTemas()` (GET a `/api/temas` y rellenar selector) | | Cristina | ✅ |
| ☐ Función `generarPreguntas()` (Validaciones, POST, manejar carga/error) | | Cristina | ✅ |
| ☐ Función `mostrarPreguntas()` (Crear elementos HTML, añadir botón "Eliminar") | | Cristina | ✅ |
| ☐ Función `eliminarPregunta(id)` (DELETE a `/api/preguntas/{id}`, recargar lista) | | Cristina | ✅ |
| ☐ Función `limpiar()` (Resetear inputs, DELETE a `/api/preguntas/tema/{tema}` si es necesario) | | Cristina | ✅ |
| ☐ Configurar *Event Listeners* (Click Generar, Click Limpiar, Change tema, Input numPreguntas) | | Cristina | ✅ |
| **4. Testing y Validación** | | | |
| **4.1 Tests de Endpoints** | | **Cristina** | |
| ☐ Crear `validacion.http` en la raíz con tests para todos los *endpoints* | | Cristina | ✅ |
| **4.2 Pruebas Manuales y Calidad** | | **Común** | |
| ☐ Backend levanta sin errores y Ollama responde | | Común | ✅ |
| ☐ Frontend carga y Selector de temas funciona | | Común | ✅ |
| ☐ Generar preguntas funciona para **todos los temas** | | Común | ✅ |
| ☐ Las preguntas se guardan en BD y se muestran en frontend | | Común | ✅ |
| ☐ Eliminar pregunta y Limpiar tema funcionan | | Común | ✅ |
| ☐ Validaciones: bloquea *numPreguntas* fuera de rango y envío sin datos | | Común | ✅ |
| **5. Dockerización (Común)** | | | |
| ☐ Crear `docker-compose.yml` en raíz que orqueste servicios | | Común | ✅ |
| ☐ Verificar que `docker compose up --build` levanta perfectamente | | Común | ✅ |
| ☐ Verificar acceso a servicios (Backend y Ollama) | | Común | ✅ |
| **6. Documentación y Entrega (Común)** | | | |
| ☐ Crear `README.md` completo (Descripción, Requisitos, Instalación, Estructura, API Endpoints, etc.) | | Común | ✅ |
| ☐ `checklist.md` completado | | Común | ✅ |
| ☐ Asegurar commits incrementales, descriptivos y con co-autoría | | Común | ✅ |
| ☐ Crear Pull Request (PR) con título y descripción requeridos | | Común | |
| ☐ **Verificar que el `.env` NO está versionado** (solo `.env.example`) | | Común | ✅ |
| ☐ Exposición en clase del proyecto funcionando | | Común | |