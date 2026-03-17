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

## 📡 API REST - Ejemplos de Interacción

### Obtener Tareas
`GET /api/v1/tasks` -> Devuelve un array de objetos de tarea.

### Crear Tarea
`POST /api/v1/tasks`
```json
{
  "title": "Aprender Express",
  "category": "Formación",
  "priority": "Alta"
}
```

### Eliminar Tarea
`DELETE /api/v1/tasks/:id` -> Devuelve un 204 si la eliminación es exitosa o 404 si el ID no existe.
