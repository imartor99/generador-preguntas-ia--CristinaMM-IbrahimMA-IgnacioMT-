import { Router } from "express";

// ⚠️ FUNCIONES DE IBRA (Aún no existen)
// Las importamos para que el código de Nacho compile y sepa qué usar.
import {
  generarPreguntas,
  obtenerPreguntas,
  eliminarPregunta,
  limpiarTema,
  eliminarTodasLasPreguntas,
  checkOllamaHealth,
} from "./services.js";
import { temas } from "./prompts.js";

const router = Router();

// ==========================================================
// 1. Endpoints de Información (Temas y Health)
// ==========================================================

// GET /api/temas: Devuelve la lista de temas para el frontend
router.get("/temas", (req, res) => {
  // La lista de temas viene del archivo prompts.js de Ibra
  res.status(200).json(temas);
});

// GET /api/health: Verifica si el servidor Express y Ollama están activos
router.get("/health", async (req, res) => {
  try {
    // Llama a la función de Ibra para chequear Ollama
    const ollamaStatus = await checkOllamaHealth();
    res.status(200).json({
      status: "ok",
      ollama: ollamaStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Si hay error, Ollama está desconectado o no responde
    res
      .status(500)
      .json({ status: "error", ollama: "disconnected", error: error.message });
  }
});

// ==========================================================
// 2. Endpoint de Generación (POST)
// ==========================================================

// POST /api/generate: Genera preguntas usando Ollama
router.post("/generate", async (req, res) => {
  try {
    const { tema, numPreguntas, subtema } = req.body;

    // VALIDACIONES (Parte de Nacho)
    if (!tema || !numPreguntas) {
      return res.status(400).json({
        success: false,
        error: "Faltan parámetros: tema y numPreguntas son obligatorios.",
        codigo: 400,
      });
    }
    if (numPreguntas < 1 || numPreguntas > 5) {
      return res.status(400).json({
        success: false,
        error: "numPreguntas debe estar entre 1 y 5.",
        codigo: 400,
      });
    }

    // ⚠️ Llama a la lógica de Ibra para generar y guardar en BD
    const preguntasGeneradas = await generarPreguntas({
      temaId: tema,
      numPreguntas,
      subtema,
    });

    res.status(200).json({
      success: true,
      preguntas: preguntasGeneradas,
      mensaje: `Generadas y guardadas ${preguntasGeneradas.length} preguntas.`,
    });
  } catch (error) {
    console.error("Error en /api/generate:", error.message);
    // Manejo de errores generales (ej: error de conexión con Ollama)
    res.status(500).json({
      success: false,
      error: "Error al procesar la generación de preguntas.",
      detalles: error.message,
      codigo: 500,
    });
  }
});

// ==========================================================
// 3. Endpoints de Lectura y Eliminación (CRUD)
// ==========================================================

// GET /api/preguntas: Obtiene preguntas (todas o filtradas por tema)
router.get("/preguntas", async (req, res) => {
  try {
    const { tema } = req.query; // Query param: ?tema=javascript
    // ⚠️ Llama a la función de Ibra con el formato correcto
    const preguntas = await obtenerPreguntas(tema ? { temaId: tema } : {});
    res.status(200).json(preguntas);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/preguntas/:id: Obtiene una pregunta específica por ID (Opcional, pero bueno tenerlo)
router.get("/preguntas/:id", async (req, res) => {
  // **NOTA:** La función obtenerPreguntas de Ibra puede ser reutilizada
  // o Ibra deberá implementar una función específica: obtenerPreguntaPorId()
  res.status(501).json({ error: "Endpoint no implementado aún." }); // 501 Not Implemented
});

// DELETE /api/preguntas/:id: Elimina una pregunta específica por ID
router.delete("/preguntas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // ⚠️ Llama a la función de Ibra (devuelve número de filas eliminadas)
    const eliminada = await eliminarPregunta(id);

    if (eliminada > 0) {
      return res
        .status(200)
        .json({ success: true, mensaje: `Pregunta con ID ${id} eliminada.` });
    } else {
      return res.status(404).json({
        success: false,
        mensaje: `Pregunta con ID ${id} no encontrada.`,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/preguntas/tema/:tema: Limpia todas las preguntas de un tema.
router.delete("/preguntas/tema/:tema", async (req, res) => {
  try {
    const { tema } = req.params;
    // ⚠️ Llama a la función de Ibra
    const count = await limpiarTema(tema);
    res.status(200).json({
      success: true,
      eliminadas: count,
      mensaje: `Eliminadas ${count} preguntas del tema: ${tema}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/preguntas: Elimina todas las preguntas de la base de datos
router.delete("/preguntas", async (req, res) => {
  try {
    // ⚠️ Llama a la función de Ibra
    const count = await eliminarTodasLasPreguntas();
    res.status(200).json({
      success: true,
      eliminadas: count,
      mensaje: `Eliminadas ${count} preguntas en total.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
