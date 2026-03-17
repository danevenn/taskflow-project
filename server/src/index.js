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
