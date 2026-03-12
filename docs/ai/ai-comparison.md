# Comparativa de IA

Este documento servirá para documentar las diferencias, ventajas, desventajas y casos de uso de distintas herramientas de Inteligencia Artificial evaluadas o utilizadas en el desarrollo del proyecto.

Para la tarea (Explicación de closures, event loop, DOM, hoisting o prototipos), aquí se reflejan las respuestas de:

- Claude:
Closures: En programación, un closure es una función que tiene acceso a variables de un ámbito exterior a ella, incluso después de que el ámbito exterior haya terminado su ejecución. Esto permite encapsular datos y funcionalidad.
Event loop: El event loop es un mecanismo en entornos de programación asíncrona, como JavaScript, que monitorea y procesa eventos del sistema operativo. Coordina la ejecución de código síncrono y asíncrono.DOM (Document Object Model): El DOM es una interfaz de programación que representa la estructura de un documento web. Permite a los programas y scripts manipular el contenido, estructura y estilo de las páginas web.
Hoisting: Es un comportamiento en JavaScript donde las declaraciones de variables y funciones se mueven a la parte superior de su ámbito antes de la ejecución del código. Esto permite usar variables y funciones antes de que estén declaradas en el código.
Prototipos: En JavaScript, los objetos heredan propiedades y métodos de un prototipo. Este prototipo es en sí mismo un objeto. El sistema de prototipos de JavaScript es la base para la herencia de objetos.

- ChatGPT:
1. Closures

Un closure ocurre cuando una función recuerda las variables del lugar donde fue creada, incluso si se ejecuta fuera de ese contexto.

📌 Idea clave: una función puede “cerrar” sobre variables externas.

function crearContador() {
  let contador = 0;

  return function() {
    contador++;
    return contador;
  };
}

const contar = crearContador();

console.log(contar()); // 1
console.log(contar()); // 2

🔎 Qué pasa aquí:

contador está dentro de crearContador
La función interna sigue teniendo acceso a esa variable
Aunque crearContador ya terminó

💡 Muy usado para:

encapsular datos
crear variables privadas
funciones factory

2. Event Loop

El event loop es el mecanismo que permite que JavaScript maneje operaciones asíncronas sin bloquear el programa.

📌 Piensa en él como un administrador de tareas.

Componentes principales:

Call Stack → donde se ejecuta el código
Web APIs → temporizadores, fetch, eventos
Callback Queue → cola de funciones listas
Event Loop → mueve tareas a la pila cuando puede

Ejemplo:

console.log("Inicio");

setTimeout(() => {
  console.log("Timeout");
}, 0);

console.log("Fin");

Salida real:

Inicio
Fin
Timeout

🔎 Porque:

setTimeout va a la cola
el event loop espera a que la pila esté vacía

3. DOM

El DOM (Document Object Model) es una representación del HTML como árbol de objetos que JavaScript puede manipular.

Ejemplo de HTML:

<h1 id="titulo">Hola</h1>


JavaScript:

const titulo = document.getElementById("titulo");
titulo.textContent = "Hola mundo";

Aquí estás modificando el DOM.

📌 Permite:

cambiar texto
modificar estilos
añadir o borrar elementos
manejar eventos

4. Hoisting

El hoisting es el comportamiento por el cual JavaScript “eleva” declaraciones al inicio del contexto durante la compilación.

Ejemplo:

console.log(x);
var x = 5;

En realidad JS lo interpreta como:

var x;
console.log(x);
x = 5;

Resultado:

undefined

⚠️ Con let y const es distinto:

console.log(x);
let x = 5;

❌ Error: Temporal Dead Zone

5. Prototipos

En JavaScript los objetos pueden heredar propiedades de otros objetos mediante prototipos.

Ejemplo:

function Persona(nombre) {
  this.nombre = nombre;
}

Persona.prototype.saludar = function() {
  console.log("Hola soy " + this.nombre);
};

const p1 = new Persona("Ana");
p1.saludar();


🔎 Aquí:

saludar vive en el prototype
todas las instancias lo comparten

📌 Esto es la base de la herencia prototípica en JavaScript.

Como se puede ver, la explicación es mucho más rica y detallada por parte de ChatGPT.

· Para la comparativa de funciones, vamos a emplear las tres siguientes:

- Una función sencilla de suma:

function sumar(a, b) {
  return a + b;
}

console.log(sumar(3, 2)); // 5

- Una función que devuelva un saludo:

function saludar(nombre) {
  console.log("Hola " + nombre);
}

saludar("Daniel");

- Una función que indique si un número es par:

function esPar(numero) {
  if (numero % 2 === 0) {
    return true;
  } else {
    return false;
  }
}

console.log(esPar(4)); // true
console.log(esPar(7)); // false

· Voy a cometer tres errores intencionales para comprobar cómo lo resuelven:

function sumar(a, "b") {
  return a +b;
}

console.log(sumar(3, 2)); // 5

function saludar(nombre) {
  console.log("Hola " + nombre)
}

saludar("Daniel);

function esPar(numero) {
  if (numero % 2 == 0) {
    return true;
  } else{
    return false;
  }
}

console.log(esPar(4)); // true
console.log(esPar(7)); // false

-- De nuevo, Claude genera la solución con sugestiones de cambio, pero nunca afirma, indicando que no es un experto en la tarea o el lenguaje. No obstante, ChatGPT devuelve la solución y las indica correctamente con una explicación del error y dónde se encuentra.

