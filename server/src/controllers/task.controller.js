const taskService = require('../services/task.service');

const getTasks = (req, res) => {
    const tasks = taskService.obtenerTodas();
    res.json(tasks);
};

const createTask = (req, res) => {
    const { title, category, priority } = req.body;

    if (!title || !category || !priority) {
        return res.status(400).json({ error: 'Título, categoría y prioridad son obligatorios' });
    }

    const newTask = taskService.crearTarea({ title, category, priority });
    res.status(201).json(newTask);
};

const deleteTask = (req, res, next) => {
    const { id } = req.params;

    try {
        taskService.eliminarTarea(id);
        res.status(204).send();
    } catch (error) {
        // Pasamos el error al middleware global
        next(error);
    }
};

module.exports = {
    getTasks,
    createTask,
    deleteTask
};
