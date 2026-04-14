const fs = require('fs');
const path = require('path');

const DATA_FILE = process.env.VERCEL ? '/tmp/tasks.json' : path.join(__dirname, '../data/tasks.json');

const leerTareas = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const guardarTareas = (tasks) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
};

const obtenerTodas = () => {
    return leerTareas();
};

const crearTarea = (data) => {
    const tasks = leerTareas();
    const newTask = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
        ...data,
        completed: false,
        createdAt: Date.now()
    };
    tasks.push(newTask);
    guardarTareas(tasks);
    return newTask;
};

const eliminarTarea = (id) => {
    let tasks = leerTareas();
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        throw new Error('NOT_FOUND');
    }
    tasks.splice(index, 1);
    guardarTareas(tasks);
};

const actualizarTarea = (id, data) => {
    let tasks = leerTareas();
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        throw new Error('NOT_FOUND');
    }
    
    // Solo permitimos actualizar ciertos campos
    const updatedTask = {
        ...tasks[index],
        ...data
    };
    
    tasks[index] = updatedTask;
    guardarTareas(tasks);
    return updatedTask;
};

const eliminarTareas = (filtros = {}) => {
    let tasks = leerTareas();
    
    if (filtros.completedOnly) {
        tasks = tasks.filter(task => !task.completed);
    } else {
        tasks = [];
    }
    
    guardarTareas(tasks);
};

module.exports = {
    obtenerTodas,
    crearTarea,
    eliminarTarea,
    actualizarTarea,
    eliminarTareas
};
