const API_URL = 'http://localhost:3000/api/v1/tasks';

export const getTasks = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`Error al obtener tareas: ${response.statusText}`);
    }
    return response.json();
};

export const createTask = async (taskData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la tarea');
    }
    return response.json();
};

export const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Tarea no encontrada');
        }
        throw new Error('Error al eliminar la tarea');
    }
    return true;
};
