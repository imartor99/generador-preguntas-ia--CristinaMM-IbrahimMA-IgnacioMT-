import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// ⚠️ Importa las rutas que acabas de crear
import apiRoutes from "./routes.js";

// ⚠️ Importa la inicialización de la BD (Tarea de Ibra: db.js)
import { initDatabase } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json()); // Para parsear el body de las peticiones JSON

// Inicializa la base de datos (Esto debe existir en db.js)
// Si Ibra no lo ha hecho, esta línea fallará, pero es la estructura correcta.
initDatabase();

// Montar las rutas de la API en /api
app.use("/api", apiRoutes);

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos del frontend (Tarea de Cristina)
// Apunta a la carpeta 'frontend' que está al mismo nivel que 'backend'
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Accede a la API en http://localhost:${PORT}/api/temas`);
});
