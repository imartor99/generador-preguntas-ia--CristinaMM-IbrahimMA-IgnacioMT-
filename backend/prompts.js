export const temas = [
  {
    id: 'javascript',
    nombre: 'JavaScript Avanzado',
    descripcion: 'Preguntas sobre ES6+, async/await, promesas y conceptos clave.',
    prompt: `
      Eres un profesor experto de JavaScript.
      Genera exactamente {num_preguntas} preguntas de opción múltiple sobre {subtema}.
      Las preguntas deben ser de nivel intermedio/avanzado.
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
    id: 'seguridad_web',
    nombre: 'Seguridad Web (OWASP)',
    descripcion: 'Preguntas sobre vulnerabilidades comunes como XSS, SQLi, CSRF.',
    prompt: `
      Eres un experto en ciberseguridad.
      Genera exactamente {num_preguntas} preguntas de opción múltiple sobre {subtema} en el contexto de seguridad web (OWASP).
      Las preguntas deben ser claras y concisas.
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