# Proyecto Taskflow

Una aplicación web de gestión de tareas con un diseño premium, construida con HTML, JavaScript y Tailwind CSS v4. Permite añadir, editar, completar, filtrar y borrar tareas, con persistencia en **LocalStorage**.

## Características
- Añadir tareas con título, categoría y prioridad.
- Edición en línea de los títulos de las tareas.
- Marcar tareas como completadas (checkbox) con estilo tachado.
- Filtrar tareas por **categoría** y **estado** (Todas / Pendientes / Completadas).
- Borrar todas las tareas con confirmación de seguridad.
- Conmutador de tema Claro / Oscuro.
- Diseño responsivo para móvil y escritorio.
- Animaciones suaves e interfaz moderna usando Tailwind CSS v4.

## Instalación y Desarrollo
1. **Requisitos previos**: Node.js (>= 18) y npm.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar Tailwind CSS en modo "watch" durante el desarrollo:
   ```bash
   npm run watch:css
   ```
   Mantén esta terminal abierta mientras editas `index.html` o los archivos fuente de Tailwind.
4. Compilar CSS para producción:
   ```bash
   npm run build:css
   ```
5. Abrir `index.html` en un navegador (o usar una extensión tipo Live Server).

## Estructura del Proyecto
```
/taskflow-project
├─ index.html          # Diseño de la página principal
├─ app.js              # Lógica central en JavaScript
├─ input.css           # Fuente de Tailwind con @theme, @custom-variant
├─ style.css           # Salida de Tailwind generada
├─ readme.md           # Documentación (este archivo)
└─ ...
```

## Funciones Principales (`app.js`)
| Función | Descripción |
|----------|-------------|
| `createTaskElement(task)` | Devuelve un elemento `<li>` que representa una tarea, incluyendo checkbox, título y botones de editar/borrar. |
| `renderTasks()` | Renderiza la lista de tareas basada en los filtros actuales, término de búsqueda y estado. |
| `saveTasks()` | Guarda el array `tasks` en el `localStorage`. |
| `loadTasks()` | Carga las tareas desde el `localStorage` al iniciar. |
| `addTask(e)` | Gestiona el envío del formulario para crear una nueva tarea. |
| `toggleTaskCompletion(id)` | Cambia el estado `completed` de una tarea y actualiza la interfaz. |
| `editTask(id)` | Solicita al usuario un nuevo título y actualiza la tarea. |
| `deleteTask(id)` | Elimina una tarea después de la confirmación del usuario. |
| `clearAllTasks()` | Borra toda la lista de tareas tras confirmar la acción. |
| `filterByCategory(category)` | Establece el filtro de categoría activo. |
| `filterByStatus(status)` | Establece el filtro de estado activo (Todas / Pendientes / Completadas). |
| `searchTasks(term)` | Actualiza el término de búsqueda utilizado por `renderTasks`. |

## Ejemplos de Uso
### Añadir una Tarea
1. Introduce un título en **Título de la tarea**.
2. Elige una **Categoría** (Trabajo, Formación, Equipo).
3. Selecciona una **Prioridad** (Alta, Media, Baja).
4. Haz clic en **Añadir Tarea**.

La tarea aparecerá en la lista con un checkbox y los iconos de editar (✏️) y borrar (🗑️).

### Editar una Tarea
Haz clic en el botón **✏️ Editar** de una tarea, escribe el nuevo título en la ventana emergente y confirma.

### Completar una Tarea
Marca el checkbox junto a una tarea. Las tareas completadas aparecerán tachadas visualmente.

### Filtrar Tareas
- Usa los botones de **Categorías** en la barra lateral para filtrar por tipo.
- Usa los botones de **Estados** (Todas, Pendientes, Completadas) para filtrar por situación.

### Borrar Todas las Tareas
Haz clic en el botón **Borrar todas las tareas** en la parte inferior de la barra lateral y confirma la acción.

## Contribución
Siéntete libre de abrir issues o enviar pull requests. Por favor, sigue el estilo de código existente y ejecuta `npm run lint` antes de realizar commits.