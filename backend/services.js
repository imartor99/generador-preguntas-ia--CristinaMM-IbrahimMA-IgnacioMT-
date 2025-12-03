import "dotenv/config"; // Carga las variables de .env
import { db } from "./db.js";
import { temas } from "./prompts.js";

// Obtenemos la URL de Ollama y el modelo desde el .env
const OLLAMA_URL = process.env.AI_API_URL;
const OLLAMA_MODEL = process.env.AI_MODEL;

/**
 * Tarea: Función para obtener los temas (sin los prompts)
 * Esto lo usará Nacho para el endpoint GET /api/temas
 */
export function obtenerTemas() {
  // Devolvemos solo la info pública, no el prompt interno
  return temas.map((t) => ({
    id: t.id,
    nombre: t.nombre,
    descripcion: t.descripcion,
  }));
}

/**
 * Tarea: Función para verificar el estado de Ollama
 * Esto lo usará Nacho para el endpoint GET /api/health
 */
export async function checkOllamaHealth() {
  try {
    // Si no hay URL definida, asumimos desconectado
    if (!OLLAMA_URL) return "disconnected";

    const response = await fetch(`${OLLAMA_URL}/api/tags`); // Endpoint ligero de Ollama
    return response.ok ? "connected" : "error";
  } catch (error) {
    return "disconnected";
  }
}

/**
 * Tarea: Función generarPreguntas
 * Conecta con Ollama, parsea la respuesta y guarda en BD.
 */
export async function generarPreguntas({
  temaId,
  numPreguntas = 3,
  subtema = "general",
}) {
  // 1. Buscar el tema y el prompt
  const tema = temas.find((t) => t.id === temaId);
  if (!tema) {
    throw new Error("Tema no encontrado");
  }

  // 2. Construir el prompt final
  const promptFinal = tema.prompt
    .replace("{num_preguntas}", numPreguntas)
    .replace("{subtema}", subtema);

  console.log(`[Ollama Service] Enviando prompt para ${temaId}...`);

  try {
    // 3. (Requisito) Manejo de Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos

    // 4. Conectar a Ollama (POST /api/generate)
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: promptFinal,
        format: "json", // Pedimos formato JSON
        stream: false, // Esperamos la respuesta completa
      }),
      signal: controller.signal, // Asignamos el controlador de timeout
    });

    // Limpiamos el timeout si la respuesta llega a tiempo
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error de Ollama: ${response.statusText}`);
    }

    const ollamaRes = await response.json();

    // La respuesta JSON de Ollama viene en 'response' como un string.
    // Hay que parsearlo dos veces.
    const contenidoParseado = JSON.parse(ollamaRes.response);
    const { preguntas } = contenidoParseado;

    if (!preguntas || !Array.isArray(preguntas)) {
      throw new Error("Formato de respuesta JSON de Ollama inesperado.");
    }

    // 5. Guardar en Base de Datos
    console.log(
      `[Ollama Service] Guardando ${preguntas.length} preguntas en BD...`
    );
    const stmt = db.prepare(
      "INSERT INTO preguntas (tema, pregunta, opciones, correcta) VALUES (?, ?, ?, ?)"
    );

    const preguntasGuardadas = [];
    for (const p of preguntas) {
      // Guardamos las 'opciones' como un string JSON
      const opcionesString = JSON.stringify(p.opciones);

      const info = stmt.run(temaId, p.pregunta, opcionesString, p.correcta);

      preguntasGuardadas.push({
        id: info.lastInsertRowid,
        tema: temaId,
        pregunta: p.pregunta,
        opciones: p.opciones,
        correcta: p.correcta,
      });
    }

    return preguntasGuardadas;
  } catch (error) {
    // 6. Manejo de Errores si ollama no responde (Timeout y conexión)
    if (error.name === "AbortError") {
      console.error("[Ollama Service] Error: Timeout de 60s alcanzado.");
      throw new Error(
        "La solicitud a Ollama ha tardado demasiado (timeout 60s)."
      );
    }
    console.error(
      "[Ollama Service] Error conectando con Ollama:",
      error.message
    );
    throw new Error(
      `No se pudo conectar con Ollama o procesar la respuesta: ${error.message}`
    );
  }
}

/**
 * Tarea: Función obtenerPreguntas(tema)
 * Busca en BD todas las preguntas (o filtradas por tema).
 */
export function obtenerPreguntas({ temaId } = {}) {
  let query = "SELECT * FROM preguntas";
  const params = [];

  if (temaId) {
    query += " WHERE tema = ?";
    params.push(temaId);
  }

  const stmt = db.prepare(query);
  const filas = stmt.all(params);

  // Convertimos el string JSON de 'opciones' de nuevo a un objeto
  return filas.map((fila) => ({
    ...fila,
    opciones: JSON.parse(fila.opciones),
  }));
}

/**
 * Tarea: Función para obtener una pregunta específica (Bonus)
 * Esto lo usará Nacho para el endpoint GET /api/preguntas/:id
 */
export function obtenerPreguntaPorId(id) {
  const stmt = db.prepare("SELECT * FROM preguntas WHERE id = ?");
  const fila = stmt.get(id);

  if (fila) {
    fila.opciones = JSON.parse(fila.opciones);
  }
  return fila; // Devuelve la fila o 'undefined' si no se encuentra
}

/**
 * Tarea: Función eliminarPregunta(id)
 */
export function eliminarPregunta(id) {
  const stmt = db.prepare("DELETE FROM preguntas WHERE id = ?");
  const info = stmt.run(id);

  // info.changes nos dice cuántas filas se borraron (debería ser 1)
  return info.changes;
}

/**
 * Tarea: Función limpiarTema(tema)
 */
export function limpiarTema(temaId) {
  const stmt = db.prepare("DELETE FROM preguntas WHERE tema = ?");
  const info = stmt.run(temaId);

  // Devolvemos el número de preguntas eliminadas
  return info.changes;
}

/**
 * Tarea: Función eliminarTodasLasPreguntas()
 * Elimina todas las preguntas de la base de datos
 */
export function eliminarTodasLasPreguntas() {
  const stmt = db.prepare("DELETE FROM preguntas");
  const info = stmt.run();

  // Devolvemos el número de preguntas eliminadas
  return info.changes;
}
