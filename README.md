# Taskflow Project

Página web profesional para la gestión de tareas con arquitectura cliente-servidor.

## 📁 Arquitectura de Carpetas

```text
taskflow-project/
├── client/             # Frontend (HTML, CSS, JS)
│   ├── src/
│   │   └── api/        # Capa de red (fetch client)
│   ├── app.js          # Lógica de UI y gestión de estados
│   └── index.html      # Estructura principal
├── server/             # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/     # Validación de entorno
│   │   ├── controllers/# Mapeo de red y validación
│   │   ├── routes/     # Definición de endpoints
│   │   ├── services/   # Lógica pura y persistencia
│   │   └── index.js    # Punto de entrada
├── docs/               # Documentación técnica
└── package.json        # Gestión unificada de dependencias
```

## 🛠️ Tecnologías y Middlewares

### Backend (Express)
- **Layered Architecture**: Separación clara entre Rutas, Controladores y Servicios para facilitar la mantenibilidad.
- **Middleware Global de Errores**: Captura excepciones no controladas y mapea errores semánticos (ej. 404 para recursos inexistentes) garantizando la estabilidad del proceso.
- **CORS**: Habilitado para permitir la comunicación segura entre el cliente y el servidor.
- **Variables de Entorno**: Gestión segura del puerto y configuraciones sensibles mediante `.env`.

### Frontend
- **Network Layer**: Comunicación asíncrona mediante la API `fetch`.
- **UI State Management**: La interfaz reacciona visualmente ante estados de carga, éxito y errores de red.

## 🚀 Cómo empezar

1.  Instala las dependencias:
    ```bash
    npm install
    ```
2.  Configura el entorno:
    Crea un archivo `.env` en la raíz con `PORT=3000`.
3.  Arranca el servidor:
    ```bash
    npm run server
    ```
4.  Compila el estilo (Tailwind):
    ```bash
    npm run build:css
    ```

## 📡 API REST - Documentación Interactiva

Si el servidor está corriendo, puedes acceder a la documentación interactiva (Swagger) en:
`http://localhost:3000/api-docs`

---

## 🛠️ Ejemplos de Interacción (Request/Response)

### 1. Obtener todas las tareas
**Endpoint:** `GET /api/v1/tasks`

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "1710682800000",
    "title": "Configurar Swagger",
    "category": "Trabajo",
    "priority": "Alta",
    "completed": false,
    "createdAt": 1710682800000
  }
]
```

### 2. Crear una nueva tarea
**Endpoint:** `POST /api/v1/tasks`

**Cuerpo (Request):**
```json
{
  "title": "Nueva Tarea Profesional",
  "category": "Formación",
  "priority": "Media"
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": "abc-123-uuid",
  "title": "Nueva Tarea Profesional",
  "category": "Formación",
  "priority": "Media",
  "completed": false,
  "createdAt": 1710682950000
}
```

**Error de Validación (400 Bad Request):**
*Si falta el campo `title`*
```json
{
  "error": "El título es obligatorio"
}
```

### 3. Eliminar una tarea
**Endpoint:** `DELETE /api/v1/tasks/:id`

**Respuesta Exitosa (24 No Content):**
*(Sin cuerpo)*

**Error No Encontrado (404 Not Found):**
*Si el ID no existe en el sistema*
```json
{
  "error": "Tarea no encontrada",
  "message": "La tarea con el ID proporcionado no existe en nuestro registro."
}
```

### 4. Error Generico (500 Internal Server Error)
En caso de fallo crítico inesperado en el servidor:
```json
{
  "error": "Error interno del servidor",
  "message": "Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde."
}
```
