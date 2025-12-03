/**
 * Lógica JavaScript para el Generador de Preguntas IA (Sin CSS).
 * Se comunica con el backend a través de la API definida.
 */

// --- 1. Constantes y Elementos del DOM ---
const BASE_URL = '/api';
const TEMA_SELECT = document.getElementById('selectorTemas');
const NUM_PREGUNTAS_INPUT = document.getElementById('numPreguntas');
const BTN_GENERAR = document.getElementById('btnGenerar');
const BTN_LIMPIAR = document.getElementById('btnLimpiar');
const LOADING_INDICATOR = document.getElementById('loadingIndicator');
const CONTENEDOR_PREGUNTAS = document.getElementById('contenedorPreguntas');

// Variable global para almacenar el tema actual (persistencia)
let temaActual = '';

// Contenedor simple para mensajes de sistema o errores (añadido fuera del contenedor de preguntas)
const MESSAGE_CONTAINER = document.createElement('p');
MESSAGE_CONTAINER.id = 'mensajeSistema';
MESSAGE_CONTAINER.style.display = 'none';
CONTENEDOR_PREGUNTAS.parentNode.insertBefore(MESSAGE_CONTAINER, CONTENEDOR_PREGUNTAS);


// --- 2. Funciones de Utilidad y UI (Mínimal UI) ---

/**
 * Muestra un mensaje de sistema o error utilizando solo texto.
 * @param {string} mensaje - El texto a mostrar.
 * @param {boolean} esError - Si es true, añade el prefijo "ERROR:".
 */
function mostrarMensaje(mensaje, esError = false) {
    MESSAGE_CONTAINER.textContent = esError ? `[ERROR] ${mensaje}` : `[INFO] ${mensaje}`;
    MESSAGE_CONTAINER.style.display = 'block';

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        MESSAGE_CONTAINER.style.display = 'none';
        MESSAGE_CONTAINER.textContent = '';
    }, 5000);
}

/**
 * Controla el estado de carga de la UI.
 * @param {boolean} isLoading - Si es true, muestra el indicador y deshabilita botones.
 */
function setLoading(isLoading) {
    // Usamos el style.display directamente ya que el HTML lo define como 'none' inicialmente.
    LOADING_INDICATOR.style.display = isLoading ? 'block' : 'none';
    BTN_GENERAR.disabled = isLoading;
    BTN_LIMPIAR.disabled = isLoading;
    TEMA_SELECT.disabled = isLoading;
    NUM_PREGUNTAS_INPUT.disabled = isLoading;
}

/**
 * Función genérica para hacer llamadas a la API y manejar errores.
 */
async function fetchApi(endpoint, config = {}) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            let errorBody = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorBody.error || errorBody.message || 'Error desconocido del servidor');
        }

        return response.json();
    } catch (error) {
        mostrarMensaje(`Fallo en la comunicación con la API: ${error.message}`, true);
        throw error;
    }
}


// --- 3. Funciones Principales ---

/**
 * 3.1 Carga dinámicamente los temas disponibles en el selector.
 */
async function cargarTemas() {
    setLoading(true);
    try {
        // GET /api/temas
        const temas = await fetchApi('/temas');

        // Limpiar opciones existentes (manteniendo el placeholder)
        const placeholder = TEMA_SELECT.options[0].outerHTML;
        TEMA_SELECT.innerHTML = placeholder; 

        // Rellenar selector dinámicamente
        temas.forEach(tema => {
            const option = document.createElement('option');
            // Se asume que los objetos de tema tienen 'id' y 'nombre'
            option.value = tema.id;
            option.textContent = tema.nombre;
            TEMA_SELECT.appendChild(option);
        });

        mostrarMensaje("Temas cargados correctamente.");
        
        // Cargar las preguntas existentes del tema por defecto/seleccionado
        if (TEMA_SELECT.value) {
             temaActual = TEMA_SELECT.value;
             await cargarPreguntas(temaActual);
        }

    } catch (error) {
        mostrarMensaje("No se pudieron cargar los temas desde el backend.", true);
    } finally {
        setLoading(false);
    }
}

/**
 * 3.2 Muestra las preguntas en el contenedor (sin CSS).
 * @param {Array<object>} preguntas - Lista de objetos de preguntas.
 */
function mostrarPreguntas(preguntas) {
    CONTENEDOR_PREGUNTAS.innerHTML = '';
    MESSAGE_CONTAINER.style.display = 'none';

    if (!preguntas || preguntas.length === 0) {
        CONTENEDOR_PREGUNTAS.innerHTML = '<p>No hay preguntas guardadas para este tema.</p>';
        return;
    }

    preguntas.forEach((pregunta, index) => {
        const card = document.createElement('div');
        card.innerHTML += '<hr>'; 
        card.dataset.id = pregunta.id;

        const titulo = document.createElement('h4');
        titulo.textContent = `Pregunta #${index + 1}`;
        
        const textoPregunta = document.createElement('p');
        textoPregunta.textContent = pregunta.texto || pregunta.pregunta;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.style.float = 'right'; // Simple style
        btnEliminar.onclick = () => eliminarPregunta(pregunta.id);

        card.appendChild(btnEliminar);
        card.appendChild(titulo);
        card.appendChild(textoPregunta);

        // Contenedor de opciones
        const opcionesContainer = document.createElement('div');
        opcionesContainer.className = 'opciones-container';

        if (pregunta.opciones) {
            const opciones = typeof pregunta.opciones === 'string' ? JSON.parse(pregunta.opciones) : pregunta.opciones;
            
            // Normalizar a objeto si es array (aunque prompts.js usa objetos)
            const opcionesObj = Array.isArray(opciones) 
                ? opciones.reduce((acc, val, idx) => ({ ...acc, [String.fromCharCode(97+idx)]: val }), {}) 
                : opciones;

            for (const [key, value] of Object.entries(opcionesObj)) {
                const label = document.createElement('label');
                label.style.display = 'block';
                label.style.margin = '5px 0';
                label.style.cursor = 'pointer';

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `pregunta_${pregunta.id}`;
                input.value = key;
                input.style.marginRight = '10px';

                label.appendChild(input);
                label.appendChild(document.createTextNode(`${key}) ${value}`));
                opcionesContainer.appendChild(label);
            }
        }
        card.appendChild(opcionesContainer);

        // Botón Responder
        const btnResponder = document.createElement('button');
        btnResponder.textContent = 'Responder';
        btnResponder.style.marginTop = '10px';
        btnResponder.onclick = () => {
            const seleccionado = card.querySelector(`input[name="pregunta_${pregunta.id}"]:checked`);
            if (!seleccionado) {
                alert('Por favor, selecciona una opción.');
                return;
            }

            const respuestaUsuario = seleccionado.value;
            const esCorrecta = respuestaUsuario === pregunta.correcta;
            
            // Feedback visual
            const resultado = document.createElement('p');
            resultado.style.fontWeight = 'bold';
            resultado.style.marginTop = '10px';
            
            if (esCorrecta) {
                resultado.textContent = '✅ ¡Correcto!';
                resultado.style.color = 'green';
            } else {
                resultado.textContent = `❌ Incorrecto. La respuesta correcta era: ${pregunta.correcta}`;
                resultado.style.color = 'red';
            }

            // Eliminar feedback anterior si existe
            const feedbackAnterior = card.querySelector('.feedback-resultado');
            if (feedbackAnterior) feedbackAnterior.remove();
            
            resultado.className = 'feedback-resultado';
            card.appendChild(resultado);
        };

        card.appendChild(btnResponder);
        CONTENEDOR_PREGUNTAS.appendChild(card);
    });
}

/**
 * 3.3 Obtiene preguntas guardadas para el tema seleccionado.
 * @param {string} tema - El tema a consultar.
 */
async function cargarPreguntas(tema) {
    if (!tema) return; 

    setLoading(true);
    temaActual = tema;

    try {
        // GET /api/preguntas?tema={tema}
        const preguntas = await fetchApi(`/preguntas?tema=${tema}`);
        mostrarPreguntas(preguntas);
    } catch (error) {
        mostrarPreguntas([]); 
    } finally {
        setLoading(false);
    }
}

/**
 * 3.4 Genera nuevas preguntas usando el modelo de IA.
 */
async function generarPreguntas() {
    const tema = TEMA_SELECT.value;
    const numPreguntas = parseInt(NUM_PREGUNTAS_INPUT.value, 10);

    // 1. Validaciones (Frontend)
    if (!tema || tema === '') {
        mostrarMensaje("Por favor, selecciona un tema para generar.", true);
        return;
    }
    if (isNaN(numPreguntas) || numPreguntas < 1 || numPreguntas > 5) {
        mostrarMensaje("El número de preguntas debe estar entre 1 y 5.", true);
        return;
    }

    setLoading(true);

    try {
        // 2. POST /api/generate
        const result = await fetchApi('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tema, numPreguntas })
        });

        mostrarMensaje(result.mensaje || `Se generaron ${result.preguntas.length} preguntas.`);
        
        // 3. Recargar la lista después de la generación
        await cargarPreguntas(tema);

    } catch (error) {
        // El error ya fue mostrado por fetchApi
    } finally {
        setLoading(false);
    }
}

/**
 * 3.5 Elimina una pregunta específica por ID.
 * @param {string} id - El ID de la pregunta a eliminar.
 */
window.eliminarPregunta = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar esta pregunta?')) {
        return;
    }

    setLoading(true);
    try {
        // DELETE /api/preguntas/{id}
        const result = await fetchApi(`/preguntas/${id}`, { method: 'DELETE' });
        
        mostrarMensaje(result.mensaje || `Pregunta con ID ${id} eliminada.`);
        
        // Recargar lista
        await cargarPreguntas(temaActual);

    } catch (error) {
        // El error ya fue mostrado por fetchApi
    } finally {
        setLoading(false);
    }
}

/**
 * 3.6 Limpia todas las preguntas del tema actual y resetea la UI.
 */
async function limpiar() {
    const tema = TEMA_SELECT.value;
    
    // Limpieza de inputs y UI
    CONTENEDOR_PREGUNTAS.innerHTML = '<p>Las preguntas aparecerán aquí.</p>';
    TEMA_SELECT.value = "";
    NUM_PREGUNTAS_INPUT.value = "3";
    temaActual = '';
    
    if (!tema) {
        mostrarMensaje("Campos reseteados (No había tema guardado en la DB).");
        return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar TODAS las preguntas guardadas del tema "${tema}"?`)) {
        mostrarMensaje("Limpieza cancelada.");
        return;
    }

    setLoading(true);
    try {
        // DELETE /api/preguntas/tema/:tema
        const result = await fetchApi(`/preguntas/tema/${tema}`, { method: 'DELETE' });

        mostrarMensaje(result.mensaje || `Eliminadas ${result.eliminadas} preguntas del tema ${tema}.`);
        
    } catch (error) {
        // El error ya fue mostrado por fetchApi
    } finally {
        setLoading(false);
    }
}

// --- 4. Event Listeners y Ejecución Inicial ---

document.addEventListener('DOMContentLoaded', () => {
    // 4.1. Cargar temas al iniciar la página
    cargarTemas();

    // 4.2. Click botón "Generar"
    BTN_GENERAR.addEventListener('click', generarPreguntas);

    // 4.3. Click botón "Limpiar"
    BTN_LIMPIAR.addEventListener('click', limpiar);
    
    // 4.4. Change tema: Cargar preguntas existentes (persistencia)
    TEMA_SELECT.addEventListener('change', (e) => {
        const nuevoTema = e.target.value;
        if (nuevoTema) {
            cargarPreguntas(nuevoTema);
        }
    });

    // 4.5. Validación de rango del input de preguntas
    NUM_PREGUNTAS_INPUT.addEventListener('input', (e) => {
        let value = parseInt(e.target.value, 10);
        if (value < 1) e.target.value = 1;
        else if (value > 5) e.target.value = 5;
        // Si no es un número válido, no permitir
        if (isNaN(value)) e.target.value = 3;
    });

    // Hacemos eliminarPregunta global para que funcione con el onclick en mostrarPreguntas.
});

