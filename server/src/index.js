const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');

const app = express();

app.use(cors());
app.use(express.json());

const taskRoutes = require('./routes/task.routes');
app.use('/api/v1/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Taskflow API is running' });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Middleware Global de Manejo de Errores
app.use((err, req, res, next) => {
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({
            error: 'Recurso no encontrado',
            message: 'La tarea solicitada no existe'
        });
    }

    // Registro del error para depuración interna
    console.error('--- ERROR NO CONTROLADO ---');
    console.error(err);
    console.error('---------------------------');

    // Respuesta genérica al cliente para seguridad
    res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.'
    });
});
