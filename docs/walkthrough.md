# Walkthrough: Project Polish and Enhancement

This document tracks the evolution and improvements made to the Taskflow Project.

## Project Evolution

### 1. Git & Infrastructure Setup
- **Branch Strategy**: Practiced a clean Git workflow using feature branches (`feature/setup`, `feature/polish`).
- **Ignore Rules**: Added a robust `.gitignore` for Node modules, OS files, and editor configurations.
- **Organization**: Restructured the project into clear `client/` and `server/` directories.

### 2. UI/UX & Accessibility Improvements
- **Typography**: Minimum 16px font size for all inputs to ensure legibility and prevent mobile auto-zoom.
- **Interactive States**: Added smooth transitions, hover effects, and focus-visible rings for better accessibility.
- **HTML Standards**: Audited the project for W3C compliance and semantic structure.

### 3. Core Features Implementation
- **Bulk Operations**: Added "Marcar todas como completadas" and "Borrar completadas" functionality.
- **Bidirectional Sync**: Refactored event listeners to ensure the "Novedades" section and "Lista de Tareas" are always in sync.
- **Persistence**: Implemented LocalStorage storage for tasks and Dark Mode preferences using JSON serialization.
- **Code Refactor**: Simplified DOM manipulation in `app.js` using modern template literals.

### 4. Layered Backend Architecture
- **Task Service**: Implemented pure logic and in-memory persistence in `server/src/services/task.service.js`. Includes error handling for non-existent IDs.
- **Task Controller**: Created `server/src/controllers/task.controller.js` to manage HTTP requests/responses, data validation (400 Bad Request), and proper status codes (201 Created, 204 No Content).
- **Task Routes**: Defined API endpoints in `server/src/routes/task.routes.js` using Express Router.
- **API Mounting**: The router is now mounted in `server/src/index.js` under the professional prefix `/api/v1/tasks`.

### 5. Global Exception Handling
- **Middleware Centralizado**: Implementado un manejador de errores de 4 parámetros en `server/src/index.js`.
- **Mapeo Semántico**:
    - **404 Not Found**: Los errores con mensaje `'NOT_FOUND'` se transforman automáticamente en respuestas 404.
    - **500 Internal Error**: Los fallos no controlados se registran en la consola del servidor pero se devuelven al cliente como un error 500 genérico para evitar fugas de información técnica.
- **Validación en Controladores**: Los controladores ahora utilizan `next(error)` para propagar fallos al middleware global de forma limpia.

### 6. Frontend Network Layer & State Management
- **API Client**: Creado `client/src/api/client.js` encapsulando peticiones `fetch` asíncronas para desacoplar la red de la UI.
- **Adiós LocalStorage**: Se ha eliminado la persistencia local de tareas en favor del servidor Node.js.
- **Estados de UI**: La interfaz ahora gestiona visualmente estados de **Carga** (spinner animado), **Éxito** (mensajes temporales) y **Error** (feedback visual ante fallos de red o validación).
- **Módulos ES**: Refactorizado `app.js` para usar `import/export`, mejorando la organización del código.

### 7. Documentación Arquitectónica
- **README Exhaustivo**: Creado un `README.md` en la raíz con la estructura del proyecto, stack tecnológico y manual de uso de la API.
- **Research Técnico**: Nuevo documento `docs/backend-api.md` detallando el propósito de herramientas como Axios, Postman, Sentry y Swagger.

## Verification Results

- [x] Bidirectional synchronization between lists verified.
- [x] LocalStorage persistence for tasks and theme verified.
- [x] Server environment validation tested (refuses to start without PORT).
- [x] Tailwind CSS build process updated and verified.
- [x] Git workflow successfully followed.
