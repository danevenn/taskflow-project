# Experimentos

En esta sección se registrarán las pruebas, experimentos de código generados por IA, integraciones experimentales y sus resultados, tanto exitosos como fallidos, para tener un histórico de aprendizaje.

## Comparativa: resolución manual vs IA en problemas genéricos

### Problema 1 (genérico): invertir una cadena

- **Enunciado**: Dada una cadena, devolver la misma cadena invertida.

- **Solución “manual” (sin IA)**  
  - **Idea**: recorrer la cadena de atrás hacia delante e ir construyendo una nueva.  
  - **Implementación (JS)**:
    ```js
    function reverseString(text) {
      let result = '';
      for (let i = text.length - 1; i >= 0; i--) {
        result += text[i];
      }
      return result;
    }
    ```
  - **Tiempo percibido**: ~2–3 minutos (problema muy sencillo).  
  - **Comprensión**: total, es un patrón clásico.

- **Solución con IA**  
  - Prompt utilizado (resumen): “Escribe una función en JS que invierta una cadena sin usar `Array.reverse` y añádeme un test sencillo.”  
  - La IA propuso algo equivalente, a veces con `split('').reverse().join('')` y con un pequeño ejemplo de uso.  
  - **Calidad**: similar, algo más idiomática al usar métodos nativos.  
  - **Tiempo percibido**: ~30 segundos (escribir prompt + leer respuesta).  

- **Comparativa**  
  - Para un problema tan sencillo, la diferencia real está en la **velocidad** y en obtener ejemplos de uso.  
  - La comprensión es prácticamente la misma; la IA no aporta demasiada profundidad extra aquí.

### Problema 2 (genérico): eliminar duplicados de un array

- **Enunciado**: Dado un array de números, devolver otro array sin elementos duplicados.

- **Solución “manual” (sin IA)**  
  - **Idea**: usar un `Set` para aprovechar que solo guarda valores únicos.  
  - **Implementación**:
    ```js
    function uniqueNumbers(numbers) {
      return Array.from(new Set(numbers));
    }
    ```
  - **Tiempo percibido**: ~3–4 minutos (incluyendo recordar sintaxis).  
  - **Comprensión**: buena, refuerza el uso de `Set` y `Array.from`.

- **Solución con IA**  
  - Prompt utilizado (resumen): “Implementa una función `uniqueNumbers` en JavaScript que reciba un array y devuelva los elementos únicos, con una breve explicación de por qué funciona.”  
  - La IA propuso prácticamente lo mismo, añadiendo explicación del funcionamiento de `Set`.  
  - **Calidad**: muy buena, incorpora explicación teórica.  
  - **Tiempo percibido**: ~40–50 segundos.

- **Comparativa**  
  - La IA aporta **contexto teórico** y explicaciones que refuerzan la comprensión.  
  - Manualmente se hace rápido, pero es fácil que se omita documentar el porqué.

### Problema 3 (genérico): validar paréntesis balanceados

- **Enunciado**: Dada una cadena con paréntesis `()`, comprobar si están balanceados.

- **Solución “manual” (sin IA)**  
  - **Idea**: usar un contador; incrementar con `(` y decrementar con `)`, nunca debe ser negativo y al final debe ser 0.  
  - **Implementación**:
    ```js
    function areParenthesesBalanced(text) {
      let balance = 0;
      for (const ch of text) {
        if (ch === '(') balance++;
        if (ch === ')') balance--;
        if (balance < 0) return false;
      }
      return balance === 0;
    }
    ```
  - **Tiempo percibido**: ~7–8 minutos (pensar el algoritmo, escribirlo y revisarlo).  
  - **Comprensión**: buena, se entiende la invariante del contador.

- **Solución con IA**  
  - Prompt utilizado (resumen): “Resuelve el problema de paréntesis balanceados en JS, explícalo paso a paso y añade casos de prueba.”  
  - La IA devolvió una solución casi idéntica, más algunos tests (`"()"`, `"(()"`, `")("`, `"()()"`).  
  - **Calidad**: alta, con más casos de prueba de los que probablemente habría escrito a mano.  
  - **Tiempo percibido**: ~1–2 minutos.

- **Comparativa**  
  - La IA acelera la **generación de casos de prueba** y refuerza la explicación del invariante.  
  - Manualmente se afianza mejor la comprensión del algoritmo, al “pensarlo” uno mismo.

## Comparativa: resolución manual vs IA en tareas del proyecto

### Tarea 1 (proyecto): extraer lógica de filtrado en `app.js`

- **Enunciado**: Extraer la lógica de filtrado y búsqueda de `renderTasks` a una función pura `getVisibleTasks(tasks, searchTerm, currentFilter)`.

- **Solución “manual” (sin IA)**  
  - **Idea**: replicar el filtro que ya existe en `renderTasks` y devolver el array resultante sin tocar el DOM.  
  - **Implementación**:
    ```js
    function getVisibleTasks(tasks, searchTerm, currentFilter) {
      const normalizedSearch = searchTerm.toLowerCase();
      return tasks.filter(task => {
        const matchesCategory =
          currentFilter === 'Todas' || task.category === currentFilter;
        const matchesSearch = task.title.toLowerCase().includes(normalizedSearch);
        return matchesCategory && matchesSearch;
      });
    }
    ```
  - **Tiempo percibido**: ~10 minutos (localizar código, extraerlo y ajustarlo).  
  - **Comprensión**: muy buena, se interioriza cómo influyen `searchTerm` y `currentFilter`.

- **Solución con IA**  
  - Prompt (resumen): “Refactoriza `renderTasks` de `app.js` para extraer una función pura `getVisibleTasks(tasks, searchTerm, currentFilter)` que contenga el filtrado y búsqueda.”  
  - La IA generó una función muy similar, además de sugerir su integración en `renderTasks`.  
  - **Calidad**: alta y consistente con el estilo actual del archivo.  
  - **Tiempo percibido**: ~3–4 minutos (incluir prompt, revisar y adaptar).

- **Comparativa**  
  - Manualmente se refuerza la comprensión del flujo de datos.  
  - Con IA se acelera la refactorización y se obtienen sugerencias de integración directa en el código.

### Tarea 2 (proyecto): añadir mensaje de estado vacío en la lista de tareas

- **Enunciado**: Mostrar un mensaje cuando no haya tareas visibles tras aplicar filtros/búsqueda.

- **Solución “manual” (sin IA)**  
  - **Idea**: comprobar si `filteredTasks.length === 0` y, en ese caso, añadir un `<li>` con texto descriptivo.  
  - **Implementación** (integrada en `renderTasks`):
    ```js
    if (filteredTasks.length === 0) {
      const emptyState = document.createElement('li');
      emptyState.className =
        'text-sm text-slate-500 dark:text-slate-400 italic';
      emptyState.textContent =
        'No hay tareas que coincidan con los filtros actuales.';
      taskList.appendChild(emptyState);
    } else {
      filteredTasks.forEach(task => {
        taskList.appendChild(createTaskElement(task, true));
      });
    }
    ```
  - **Tiempo percibido**: ~5 minutos.  
  - **Comprensión**: clara; se entiende bien la diferencia entre estado “con resultados” y “sin resultados”.

- **Solución con IA**  
  - Prompt (resumen): “En `renderTasks` de `app.js`, si no hay tareas tras el filtrado, muestra un mensaje de estado vacío, usando Tailwind y manteniendo el estilo actual.”  
  - La IA propuso casi el mismo bloque, con ligeras variaciones en el texto.  
  - **Calidad**: buena, manteniendo coherencia visual.  
  - **Tiempo percibido**: ~2–3 minutos.

- **Comparativa**  
  - Es una mejora pequeña donde la IA no aporta mucho más que velocidad.  
  - Manualmente es sencillo y sirve para practicar la manipulación del DOM y el uso de clases Tailwind.

### Tarea 3 (proyecto): añadir JSDoc a funciones clave

- **Enunciado**: Documentar con JSDoc las funciones `initTheme`, `loadTasks` y `createTaskElement`.

- **Solución “manual” (sin IA)**  
  - **Idea**: redactar descripciones breves y tipos básicos para parámetros y retorno.  
  - **Ejemplo**:
    ```js
    /**
     * Inicializa el modo de tema (claro/oscuro) según localStorage
     * y las preferencias del sistema, actualizando los iconos del botón.
     */
    function initTheme() { /* ... */ }
    ```
  - **Tiempo percibido**: ~10–12 minutos para varias funciones.  
  - **Comprensión**: obliga a pensar qué hace realmente cada función y sus entradas/salidas.

- **Solución con IA**  
  - Prompt (resumen): “Añade bloques JSDoc a las funciones `initTheme`, `loadTasks` y `createTaskElement` de `app.js`, siguiendo un estilo conciso y claro.”  
  - La IA generó bloques JSDoc detallados, incluyendo la estructura de `task` en `createTaskElement`.  
  - **Calidad**: muy alta; buena precisión al describir parámetros y retorno.  
  - **Tiempo percibido**: ~4–5 minutos (revisar y ajustar pequeños matices).

- **Comparativa**  
  - Manualmente se gana mucha **claridad conceptual** de lo que hace cada función.  
  - Con IA se gana en **velocidad** y en **consistencia de formato**, ideal cuando hay muchas funciones que documentar.

## Conclusiones generales del experimento

- Para **problemas muy sencillos**, la IA aporta sobre todo velocidad y algún ejemplo adicional, pero la ganancia en comprensión es moderada.  
- Para problemas de **algoritmia ligera** (paréntesis, estructuras de datos), la IA destaca al generar más casos de prueba y mejores explicaciones, mientras que la resolución manual consolida mejor la intuición del algoritmo.  
- En tareas del propio proyecto:
  - La **refactorización** y la **documentación** se benefician mucho de la IA, tanto en calidad como en rapidez.  
  - Las pequeñas mejoras de UI/UX (mensajes de estado, microinteracciones) son sencillas de abordar a mano y buenas para practicar DOM y Tailwind.  
- Una combinación equilibrada parece óptima:  
  - resolver manualmente los problemas clave al menos una vez,  
  - y apoyarse en la IA para acelerar refactors repetitivos, documentación y generación de casos de prueba.
