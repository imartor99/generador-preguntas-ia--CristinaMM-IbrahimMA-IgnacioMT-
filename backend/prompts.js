export const temas = [
  {
    id: 'javascript',
    nombre: 'JavaScript (DOM & Fetch)',
    descripcion: 'Preguntas sobre manipulación del DOM, Fetch API y asincronía.',
    prompt: `
      Eres un profesor experto de JavaScript.
      Genera exactamente {num_preguntas} preguntas de opción múltiple sobre {subtema} enfocadas en DOM, Fetch API y manejo de eventos.
      Las preguntas deben ser prácticas.
      Incluye 4 opciones (a, b, c, d) y marca la respuesta correcta.

      Devuelve SÓLO un objeto JSON válido con la siguiente estructura:
      {
        "preguntas": [
          {
            "pregunta": "¿...",
            "opciones": { "a": "...", "b": "...", "c": "...", "d": "..." },
            "correcta": "c"
          }
        ]
      }
    `
  },
  {
    id: 'css_labels',
    nombre: 'Etiquetas y Propiedades CSS',
    descripcion: 'Preguntas sobre Grid, Flexbox, Transform, Width y selectores.',
    prompt: `
      Eres un experto en CSS y diseño web.
      Genera exactamente {num_preguntas} preguntas de opción múltiple sobre {subtema} relacionadas con propiedades como display (grid/flex), transform, box-model, y selectores.
      Incluye 4 opciones (a, b, c, d) y marca la respuesta correcta.

      Devuelve SÓLO un objeto JSON válido con la siguiente estructura:
      {
        "preguntas": [
          {
            "pregunta": "¿...",
            "opciones": { "a": "...", "b": "...", "c": "...", "d": "..." },
            "correcta": "b"
          }
        ]
      }
    `
  },
  {
    id: 'git_commands',
    nombre: 'Comandos GIT',
    descripcion: 'Preguntas sobre comandos esenciales de Git (commit, push, pull, merge).',
    prompt: `
      Eres un experto en control de versiones con Git.
      Genera exactamente {num_preguntas} preguntas de opción múltiple sobre {subtema} enfocadas en comandos de terminal de Git.
      Incluye 4 opciones (a, b, c, d) y marca la respuesta correcta.

      Devuelve SÓLO un objeto JSON válido con la siguiente estructura:
      {
        "preguntas": [
          {
            "pregunta": "¿...",
            "opciones": { "a": "...", "b": "...", "c": "...", "d": "..." },
            "correcta": "a"
          }
        ]
      }
    `
  },
  {
    id: 'english',
    nombre: 'Inglés Técnico',
    descripcion: 'Preguntas de inglés enfocadas en tecnología y programación.',
    prompt: `
      Eres un profesor de inglés para programadores.
      Genera exactamente {num_preguntas} preguntas de opción múltiple sobre {subtema} (vocabulario técnico, gramática en contexto IT).
      Incluye 4 opciones (a, b, c, d) y marca la respuesta correcta.

      Devuelve SÓLO un objeto JSON válido con la siguiente estructura:
      {
        "preguntas": [
          {
            "pregunta": "¿...",
            "opciones": { "a": "...", "b": "...", "c": "...", "d": "..." },
            "correcta": "d"
          }
        ]
      }
    `
  },
  {
    id: 'historia_ia',
    nombre: 'Historia de la IA',
    descripcion: 'Preguntas sobre hitos, pioneros y conceptos históricos de la IA.',
    prompt: `
      Eres un historiador experto en tecnología e inteligencia artificial.
      Genera exactamente {num_preguntas} preguntas de opción múltiple sobre {subtema} relacionado con la historia de la IA.
      Incluye 4 opciones (a, b, c, d) y marca la respuesta correcta.

      Devuelve SÓLO un objeto JSON válido con la siguiente estructura:
      {
        "preguntas": [
          {
            "pregunta": "¿...",
            "opciones": { "a": "...", "b": "...", "c": "...", "d": "..." },
            "correcta": "a"
          }
        ]
      }
    `
  }
];