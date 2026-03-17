# Taskflow Project - Backend API Documentation

Esta documentación técnica detalla las herramientas y estándares utilizados para la construcción, documentación y monitoreo de la API REST del proyecto Taskflow.

## Herramientas de Desarrollo y API

### 1. Axios
**¿Qué es?**  
Axios es una librería cliente HTTP basada en promesas para Node.js y el navegador. Se utiliza como alternativa a la API nativa `fetch`.

**¿Por qué se usa?**  
- **Transformación automática**: Convierte automáticamente los datos a JSON.
- **Interceptores**: Permite ejecutar lógica global antes de que una petición se envíe o después de recibir una respuesta (ej. añadir tokens de autenticación).
- **Compatibilidad**: Ofrece un soporte más amplio en navegadores antiguos y una sintaxis más limpia para el manejo de errores.

### 2. Postman
**¿Qué es?**  
Es la plataforma líder para el desarrollo y prueba de APIs. Permite construir peticiones HTTP de forma visual.

**¿Por qué se usa?**  
- **Colecciones**: Permite agrupar peticiones y compartirlas con el equipo.
- **Automatización**: Se pueden escribir scripts de prueba para verificar que el servidor siempre devuelva los códigos de estado correctos (200, 201, 404, etc.).
- **Documentación**: Genera automáticamente documentación técnica legible a partir de las pruebas.

### 3. Sentry
**¿Qué es?**  
Es una plataforma de monitoreo de aplicaciones que rastrea errores y cuelgues en tiempo real, tanto en el frontend como en el backend.

**¿Por qué se usa?**  
- **Visibilidad**: En entornos de producción, los errores no se ven en la consola del desarrollador. Sentry alerta mediante emails o Slack cuando ocurre un fallo.
- **Diagnóstico**: Proporciona la traza completa (stack trace) del error y el contexto del usuario (navegador, URL, parámetros) para facilitar su corrección.

### 4. Swagger (OpenAPI)
**¿Qué es?**  
Es un conjunto de herramientas para diseñar, construir y documentar APIs REST siguiendo la especificación OpenAPI.

**¿Por qué se usa?**  
- **Documentación Interactiva**: Genera una UI web donde otros desarrolladores pueden probar los endpoints sin escribir código.
- **Estandarización**: Garantiza que la API siga un contrato claro y predecible, facilitando la integración con diferentes frontends o aplicaciones móviles.

---

## Arquitectura de Errores en Taskflow

Nuestra API implementa un **Middleware Global de Manejo de Errores** que garantiza que el servidor nunca se detenga ante un fallo inesperado.

1.  **Mapeo Semántico**: Si un servicio lanza un error `'NOT_FOUND'`, el middleware lo captura y devuelve un **404**.
2.  **Seguridad**: En caso de errores desconocidos, el sistema registra el fallo original para los desarrolladores pero devuelve un **500 Internal Error** genérico al usuario, evitando la exposición de rutas de archivos o bases de datos sensibles.
