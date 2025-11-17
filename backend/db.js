import Database from 'better-sqlite3';
import path from 'path';

// Define la ruta a la base de datos.
// 'db' es la carpeta que creaste dentro de 'backend'.
const dbPath = path.resolve('backend', 'db', 'preguntas.db');

// Inicializa la base de datos
// verbose: console.log nos mostrará las consultas SQL que se ejecuten
export const db = new Database(dbPath, { verbose: console.log });

// --- Creación de tablas ---
// Usamos 'TEXT' para 'opciones' y lo guardaremos como un string JSON.
// Usamos 'TEXT' para 'tema' para guardar el 'id' del tema (ej: 'javascript')
const createTableQuery = `
CREATE TABLE IF NOT EXISTS preguntas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tema TEXT NOT NULL,
  pregunta TEXT NOT NULL,
  opciones TEXT,
  correcta TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Ejecutamos la consulta para crear la tabla
db.exec(createTableQuery);

console.log('Base de datos conectada y tabla "preguntas" asegurada.');