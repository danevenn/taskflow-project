# Flujo de trabajo con Cursor

En este documento se detallará el flujo de trabajo, atajos, mejores prácticas y configuraciones útiles al utilizar el editor Cursor y sus funcionalidades de Inteligencia Artificial integradas.

Atajos:
Cmd + E - Para liberar espacio de la barra de documentos y el código.
Cmd + L - Para dirigirte al chat automáticamente y escribir el prompt.
Cmd + K - Para abrir el generador de código.

Se ha podido mejorar el código mediante el chat, optimizando los documentos y accesos de Tailwind debido a su versión 4, comprimiendo la información con un documento de referencia (Dentro de .vscode) y eliminando y depurando el resto de archivos de referencia.

Workflow de mejoras:

- Mapeo del stack y estructura del repositorio (manifiestos, scripts, carpetas clave).
- Revisado de configuración de calidad: lint/format, tests, CI, TypeScript/Build.
- Inspección de código de negocio principal para smells, errores comunes y oportunidades de refactor.
- Revisado de seguridad y secretos (env, logging, auth, dependencias).
- Entrega de lista priorizada de mejoras + quick wins + recomendaciones a medio plazo.
- Añadir comentarios JSDoc en funciones clave del proyecto para mejorar la auto-documentación y la comprensión del código.

Detalle de mejoras aplicables al proyecto TASKFLOW-PROJECT:

- Calidad de código y tooling
  - Añadir `.gitignore` para excluir `node_modules/`, `style.css`, `.DS_Store` y otros artefactos generados.
  - Dejar de versionar `node_modules` y regenerarlo siempre vía `npm install`.
  - Incorporar tooling básico de calidad: ESLint y/o Prettier con scripts `npm run lint` y `npm run format`.
  - Valorar la introducción de tests unitarios sencillos para la lógica de tareas (filtros, ordenación por prioridad, cálculo de “Novedades”).
  - Incluir comentarios JSDoc en funciones como `initTheme`, `loadTasks`, `saveTasks`, `createTaskElement`, `renderTasks` y `updateNovedades` para describir claramente su propósito, parámetros y valores de retorno.

- Seguridad y robustez
  - Reescribir `createTaskElement` para eliminar `innerHTML` con datos de usuario y construir los nodos con `createElement` y `textContent`.
  - Envolver el uso de `JSON.parse` sobre `localStorage` en un bloque `try/catch`, limpiando o reinicializando los datos si están corruptos.

- Diseño y estructura del código
  - Separar el identificador de la tarea (`id`) del timestamp de creación (`createdAt`), evitando sobrecargar el campo `id` con responsabilidades adicionales.
  - Extraer constantes compartidas (`PRIORITIES`, `CATEGORIES`, mapa de orden de prioridad) para usarlas de forma consistente en la lógica y la interfaz.
  - Unificar el control de visibilidad del bloque “Ver más tareas recientes” utilizando de forma consistente clases CSS (`hidden`) o `style.display`, pero no ambas mezcladas.

- UX y accesibilidad
  - Mejorar la accesibilidad de los filtros de categorías añadiendo `role="radiogroup"` y `role="radio"` con `aria-checked` según el estado activo.
  - Añadir un estado vacío claro en la lista de tareas cuando no haya resultados (por ejemplo, “No hay tareas que coincidan con los filtros actuales”).

- Rendimiento y experiencia de desarrollo
  - Mantener la estrategia de cachear selectores de DOM y evitar consultas repetidas dentro de bucles en futuros crecimientos de la app.
  - Añadir scripts npm de apoyo, como un `start` con un servidor estático sencillo (`serve`, `http-server`, etc.) y, opcionalmente, un script `clean` para regenerar `style.css`.

- Documentación
  - Ampliar el `readme.md` con la descripción del modelo de datos de la tarea (`id`, `title`, `category`, `priority`, `createdAt`) y la lógica de la sección de “Novedades”.
  - Documentar explícitamente el uso de `localStorage`, sus limitaciones y el alcance esperado de la aplicación.

## Uso de MCP en Cursor para este proyecto

### Instalación y configuración de servidores MCP

- Se ha creado el fichero `.cursor/mcp.json` en la raíz del proyecto con dos servidores MCP:
  - **filesystem**: configurado con `npx @modelcontextprotocol/server-filesystem .` para dar acceso al árbol de archivos de `taskflow-project`.
  - **github**: configurado con `npx @modelcontextprotocol/server-github` y la variable de entorno `GITHUB_PERSONAL_ACCESS_TOKEN` para interactuar con repositorios de GitHub.
- Tras crear el fichero, se ha reiniciado Cursor para que los servidores MCP quedaran disponibles en la sesión de la IA.

### Consultas realizadas vía MCP (filesystem)

1. **list_allowed_directories**
   - **Tool**: `list_allowed_directories` (servidor `project-0-taskflow-project-filesystem`).
   - **Objetivo**: Confirmar qué rutas puede leer/escribir el servidor de filesystem.
   - **Resultado**: Directorio permitido `/Users/danny/Cursor/taskflow-project`, es decir, todo el workspace del proyecto actual.

2. **list_directory** sobre la raíz del proyecto
   - **Tool**: `list_directory` con `path=/Users/danny/Cursor/taskflow-project`.
   - **Objetivo**: Obtener un listado de alto nivel de los ficheros y carpetas del repositorio.
   - **Resultado (resumen)**: Se listan `.cursor`, `.git`, `.vscode`, `app.js`, `docs`, `index.html`, `input.css`, `node_modules`, `package-lock.json`, `package.json`, `readme.md` y `style.css`, distinguiendo entre `[FILE]` y `[DIR]`.

3. **list_directory_with_sizes** sobre la raíz del proyecto
   - **Tool**: `list_directory_with_sizes` con `path=/Users/danny/Cursor/taskflow-project` y `sortBy="name"`.
   - **Objetivo**: Ver tamaños aproximados de los archivos principales del proyecto.
   - **Resultado (resumen)**: Se reportan tamaños para archivos clave (`app.js`, `index.html`, `input.css`, `package-lock.json`, `package.json`, `readme.md`, `style.css`) y un total combinado de ~87 KB (sin contar el contenido de `node_modules`).

4. **directory_tree** sobre el directorio `docs`
   - **Tool**: `directory_tree` con `path=/Users/danny/Cursor/taskflow-project/docs` y `excludePatterns=["**/node_modules/**"]`.
   - **Objetivo**: Obtener un árbol JSON de la documentación del proyecto.
   - **Resultado (resumen)**: Se muestra una estructura con:
     - archivo `.DS_Store`
     - directorio `ai` con los ficheros `ai-comparison.md`, `cursor-workflow.md`, `experiments.md`, `prompt-engineering.md` y `reflection.md`.

5. **search_files** y **read_text_file**
   - **search_files**
     - **Tool**: `search_files` con `path=/Users/danny/Cursor/taskflow-project`, `pattern="**/*.js"` y exclusión de `node_modules`.
     - **Objetivo**: Localizar archivos JavaScript propios del proyecto.
     - **Resultado (resumen)**: Se localiza `app.js` como principal archivo JS de la aplicación.
   - **read_text_file**
     - **Tool**: `read_text_file` con `path=/Users/danny/Cursor/taskflow-project/readme.md` y `head=20`.
     - **Objetivo**: Leer el encabezado de la documentación principal del proyecto sin abrir manualmente el archivo.
     - **Resultado (resumen)**: Se obtiene la sección inicial del `readme.md` donde se describen tecnologías usadas (HTML5, JavaScript, Tailwind CSS v4, Local Storage) y los pasos de instalación y comandos `npm install`, `npm run watch:css`.

