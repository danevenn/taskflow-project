let tasks = [];

const obtenerTodas = () => {
    return tasks;
};

const crearTarea = (data) => {
    const newTask = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
        ...data,
        completed: false,
        createdAt: Date.now()
    };
    tasks.push(newTask);
    return newTask;
};

const eliminarTarea = (id) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        throw new Error('NOT_FOUND');
    }
    tasks.splice(index, 1);
};

module.exports = {
    obtenerTodas,
    crearTarea,
    eliminarTarea
};
