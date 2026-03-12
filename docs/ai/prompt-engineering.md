# Ingeniería de Prompts

Este archivo documentará técnicas, ejemplos de prompts efectivos, reglas de contexto y metodologías utilizadas para obtener los mejores resultados de los modelos de lenguaje a lo largo del desarrollo.

## Prompts reutilizables para este proyecto

A continuación se recogen varios tipos de prompts pensados para usar en Cursor con este repositorio (`taskflow-project`). Cada ejemplo incluye:
- **Tipo de técnica** (rol, few-shot, razonamiento, restricciones…).
- **Prompt listo para copiar/pegar**.
- **Por qué funciona bien**.

### 1. Rol claro: desarrollador senior del propio proyecto

- **Técnica**: Definir rol + contexto del repo.
- **Prompt**:

> Actúa como un desarrollador senior que conoce en profundidad este repositorio `taskflow-project` (HTML + JS vanilla + Tailwind v4 y LocalStorage).  
>  
> Revisa el archivo `app.js` y haz una propuesta de mejora centrada en:  
> - legibilidad del código,  
> - seguridad en el manejo del DOM (sin usar `innerHTML` con datos de usuario),  
> - uso consistente de `createdAt` y `priority`.  
>  
> Explica los cambios propuestos en 5–8 líneas, sin aplicar todavía ningún cambio en los archivos.

- **Por qué funciona bien**:  
  - El rol (“desarrollador senior del propio proyecto”) orienta al modelo a priorizar buenas prácticas reales.  
  - El contexto técnico evita respuestas genéricas.  
  - La petición explícita de “no aplicar cambios todavía” controla el alcance de la acción.

### 2. Rol + acción concreta de refactorización

- **Técnica**: Rol especializado + tarea específica.
- **Prompt**:

> Actúa como un desarrollador senior de JavaScript especializado en código frontend sin framework (DOM puro).  
>  
> Refactoriza la función `renderTasks` de `app.js` para:  
> - separar filtrado/ordenación de la lógica de pintado en el DOM,  
> - mantener el comportamiento actual de búsqueda y filtros,  
> - conservar el mensaje de “estado vacío”.  
>  
> Devuélveme solo la nueva versión de `renderTasks` y, si necesitas funciones auxiliares, inclúyelas también.

- **Por qué funciona bien**:  
  - El rol está alineado con la tecnología usada.  
  - Se acota el alcance: solo `renderTasks` y posibles helpers.  
  - Se minimiza el ruido pidiendo “solo la nueva versión”.

### 3. Few-shot para estilo de comentarios JSDoc

- **Técnica**: Few-shot prompting (dar ejemplos del formato deseado).
- **Prompt**:

> Quiero que añadas comentarios JSDoc a funciones de `app.js` siguiendo exactamente este estilo de ejemplo:  
>  
> ```js
> /**
>  * Inicializa el tema claro/oscuro a partir de localStorage y preferencias del sistema.
>  */
> function initTheme() { /* ... */ }
> ```  
>  
> y para funciones con parámetros:  
>  
> ```js
> /**
>  * Crea un elemento de lista HTML para representar una tarea.
>  * @param {Object} task - Tarea a representar.
>  * @param {string} task.id - Identificador único.
>  * @param {string} task.title - Título visible.
>  */
> function createTaskElement(task) { /* ... */ }
> ```  
>  
> A partir de estos ejemplos, añade JSDoc a las funciones `loadTasks`, `saveTasks`, `updateNovedades` y cualquier otra función pública relevante en `app.js`.  
> Devuélveme solo las firmas de función con sus bloques JSDoc.

- **Por qué funciona bien**:  
  - Los ejemplos concretos (few-shot) fijan el patrón exacto de JSDoc.  
  - El modelo “imita” el estilo de los ejemplos para nuevas funciones.  
  - Se limita la salida a las firmas, evitando bloques de código demasiado largos.

### 4. Few-shot para generación de nuevas funciones similares

- **Técnica**: Few-shot + analogía.
- **Prompt**:

> Este proyecto ya tiene estas funciones relacionadas con tareas (resumen conceptual):  
> - `renderTasks`: filtra, ordena por prioridad y pinta tareas en la lista principal.  
> - `updateNovedades`: calcula las tareas de los últimos 3 días y las muestra en la sección de Novedades.  
>  
> Usando estas funciones como referencia, genera una nueva función `getTasksSummary(tasks)` que devuelva un objeto con:  
> - número total de tareas,  
> - número de tareas por categoría,  
> - número de tareas por prioridad.  
>  
> Devuélvela como función pura (sin tocar el DOM) y con un breve bloque JSDoc.

- **Por qué funciona bien**:  
  - Se inspira en funciones existentes sin copiarlas literalmente.  
  - Pide una función pura reutilizable (más fácil de testear).  
  - El modelo entiende el dominio “tareas” a partir de los ejemplos.

### 5. Razonamiento paso a paso para análisis de bugs

- **Técnica**: Razonamiento guiado (step-by-step).
- **Prompt**:

> El proyecto `taskflow-project` tiene comportamiento inesperado en la sección de “Novedades”: algunas tareas recientes no aparecen.  
>  
> 1. Razona paso a paso (en voz alta) cuáles pueden ser las causas, teniendo en cuenta que las tareas tienen campos `id`, `priority`, `category` y `createdAt`.  
> 2. Propón cómo ajustar `updateNovedades` para basarse siempre en `createdAt` y no depender de `id`.  
> 3. Solo al final, después del razonamiento, dame el código sugerido para `updateNovedades`.

- **Por qué funciona bien**:  
  - Obliga al modelo a explorar hipótesis antes de dar código.  
  - Separa claramente análisis y propuesta de solución.  
  - Reduce respuestas tipo “copia y pega” sin comprender el flujo.

### 6. Razonamiento paso a paso para diseño de nuevas features

- **Técnica**: Razonamiento estructurado para diseño antes de codificar.
- **Prompt**:

> Quiero añadir al proyecto `taskflow-project` una nueva métrica: un pequeño panel lateral que muestre “Tareas por prioridad” en formato contador.  
>  
> 1. Diseña la estructura de datos mínima que necesita este panel (a partir del array `tasks`).  
> 2. Propón una función pura que reciba `tasks` y devuelva esa estructura.  
> 3. Propón una función de renderizado en el DOM que use esa estructura para actualizar el panel (sin dar aún el HTML completo, solo pseudo-código o estructura de funciones).  
> 4. Finalmente, sugiere dónde integrar estas funciones en `app.js` sin romper la lógica actual.

- **Por qué funciona bien**:  
  - Fuerza a pensar primero en datos y responsabilidades, no en Tailwind.  
  - Estructura la respuesta en pasos, lo que facilita aplicarlo después.  
  - Es útil para features nuevas sin tocar aún archivos.

### 7. Restricciones claras en la respuesta (formato y longitud)

- **Técnica**: Restricciones explícitas de formato y tamaño.
- **Prompt**:

> Refactoriza `app.js` para extraer la lógica de filtrado y ordenación de tareas a una función pura `getVisibleTasks(tasks, searchTerm, currentFilter)`.  
>  
> Restricciones:  
> - Devuélveme **solo** la nueva función `getVisibleTasks` (no el resto del archivo).  
> - La función debe ser pura (sin acceso al DOM ni a `localStorage`).  
> - Explica la función en máximo 4 líneas de texto después del bloque de código.

- **Por qué funciona bien**:  
  - Reduce el riesgo de que el modelo devuelva todo el archivo.  
  - Las restricciones de pureza guían a una mejor arquitectura.  
  - El límite de explicación evita bloques de texto demasiado largos.

### 8. Restricciones de estilo y compatibilidad

- **Técnica**: Restricciones de estilo de código y entorno.
- **Prompt**:

> Propón mejoras en `index.html` para aumentar la accesibilidad (roles ARIA, labels claros, mejor semántica), manteniendo:  
> - el uso de Tailwind CSS v4,  
> - la estructura básica de cabecera, sección principal y barra lateral,  
> - compatibilidad con navegadores modernos sin dependencias adicionales.  
>  
> Devuélveme solo los fragmentos de HTML que cambiarías, marcando claramente comentarios `<!-- antes -->` y `<!-- después -->`.

- **Por qué funciona bien**:  
  - Las restricciones de entorno evitan introducir librerías o patrones que no encajan.  
  - El formato “antes/después” facilita aplicar solo lo relevante.  
  - Se centra en accesibilidad, no en rediseñar todo el layout.

### 9. Prompt para documentación automática a partir de código existente

- **Técnica**: Generación de docs a partir de código + formato deseado.
- **Prompt**:

> A partir del archivo `app.js`, genera una sección de documentación para `readme.md` titulada “Modelo de datos de las tareas y lógica de novedades”, que incluya:  
> - descripción de los campos de la tarea (`id`, `title`, `category`, `priority`, `createdAt`),  
> - explicación de cómo se calculan las tareas recientes en los últimos 3 días,  
> - advertencias sobre el uso de `localStorage` (persistencia local, datos no sensibles).  
>  
> Devuélvelo en formato Markdown listo para pegar en el `readme.md`.

- **Por qué funciona bien**:  
  - Aprovecha el conocimiento actual del código para generar doc coherente.  
  - Fija sección/título y formato Markdown, lo que simplifica su integración.  
  - Es una forma rápida de mantener código y documentación alineados.

### 10. Prompt integral: análisis + cambios + actualización de docs

- **Técnica**: Encadenar tareas con restricciones claras.
- **Prompt**:

> Actúa como un desarrollador senior responsable del mantenimiento de `taskflow-project`.  
>  
> Tareas:  
> 1. Revisa `app.js` y detecta al menos 3 oportunidades de mejora adicionales (más allá de las ya aplicadas: seguridad DOM, `createdAt`, JSDoc).  
> 2. Propón cambios concretos en el código para cada mejora (en bloques pequeños y separados).  
> 3. Sugiere una actualización del archivo `docs/ai/cursor-workflow.md` para reflejar estas nuevas mejoras.  
>  
> Mantén la respuesta por debajo de 500 palabras y organiza el contenido en secciones con títulos `###`.

- **Por qué funciona bien**:  
  - Guía al modelo a trabajar de forma holística: análisis, código y documentación.  
  - El límite de palabras incentiva respuestas concisas y accionables.  
  - La estructura en secciones hace que sea fácil convertir el resultado en cambios concretos en el repo.
