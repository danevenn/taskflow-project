## Tecnologías Utilizadas
- **HTML5 & JavaScript**
- **Tailwind CSS v4** para el estilado
- **Local Storage** para la persistencia de datos

## Instalación y Desarrollo

Este proyecto utiliza el CLI de Tailwind CSS v4 para compilar los estilos de forma local. Sigue estos pasos para trabajar en el proyecto:

1. **Instalar dependencias:**
   Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu equipo y ejecuta:
   ```bash
   npm install
   ```

2. **Modo Desarrollo (Watch):**
   Para modificar el HTML o el archivo de configuración de Tailwind y compilar automáticamente los estilos de salida, ejecuta:
   ```bash
   npm run watch:css
   ```
   Mantén esta terminal abierta mientras trabajas.

3. **Construcción para Producción:**
   Para compilar el CSS final una vez (`style.css`), ejecuta:
   ```bash
   npm run build:css
   ```

4. **Visualizar el Proyecto:**
   Abre el archivo `index.html` en tu navegador o utiliza una extensión como Live Server en tu editor de código.

## Estructura del proyecto
- `index.html`: Estructura principal, con clases de Tailwind.
- `app.js`: Lógica de la aplicación y generación dinámica de elementos.
- `input.css`: Archivo de entrada de configuraciones globales de Tailwind (@theme).
- `style.css`: Estilos de salida **autogenerados** por el CLI de Tailwind.
- `tailwind.config.js`: Archivo de configuración auxiliar para extender el tema de Tailwind.