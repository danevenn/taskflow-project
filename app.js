document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilters = document.querySelectorAll('.filter-btn');

    let tasks = [];
    let currentFilter = 'Todas';

    // 1. Cargar tareas desde LocalStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    }

    // 2. Guardar tareas en LocalStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Helper: crear el elemento DOM de una tarea
    function createTaskElement(task, showDeleteBtn = true) {
        const li = document.createElement('li');
        li.className = 'task-item';

        let badgeClass = 'badge-low';
        if (task.priority === 'Alta') badgeClass = 'badge-high';
        else if (task.priority === 'Media') badgeClass = 'badge-medium';

        let deleteBtnHTML = showDeleteBtn ? `<button class="delete-btn" data-id="${task.id}">X</button>` : '';

        li.innerHTML = `
            <span class="task-title">${task.title}</span>
            <span class="task-category">${task.category}</span>
            <span class="task-badge ${badgeClass}">${task.priority}</span>
            ${deleteBtnHTML}
        `;
        return li;
    }

    // 3. Renderizar las tareas
    function renderTasks() {
        taskList.innerHTML = '';

        const searchTerm = searchInput.value.toLowerCase();

        const filteredTasks = tasks.filter(task => {
            const matchesCategory = currentFilter === 'Todas' || task.category === currentFilter;
            const matchesSearch = task.title.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        const priorityMap = { 'Alta': 3, 'Media': 2, 'Baja': 1 };

        filteredTasks.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);

        filteredTasks.forEach(task => {
            taskList.appendChild(createTaskElement(task, true));
        });

        updateNovedades();
    }

    // Actualizar sección de Novedades (últimos 3 días)
    function updateNovedades() {
        const recentTasksCountEl = document.getElementById('recentTasksCount');
        const recentTasksListEl = document.getElementById('recentTasksList');
        const moreRecentTasksContainerEl = document.getElementById('moreRecentTasksContainer');
        const moreRecentTasksListEl = document.getElementById('moreRecentTasksList');

        if (!recentTasksCountEl || !recentTasksListEl) return;

        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);

        // Asumimos que task.id es el timestamp de creación
        const recentTasks = tasks.filter(task => {
            const taskTimestamp = parseInt(task.id);
            return !isNaN(taskTimestamp) && taskTimestamp >= threeDaysAgo;
        }).sort((a, b) => parseInt(b.id) - parseInt(a.id)); // Más recientes primero

        recentTasksCountEl.textContent = recentTasks.length;

        // Limpiar listas
        recentTasksListEl.innerHTML = '';
        if (moreRecentTasksListEl) moreRecentTasksListEl.innerHTML = '';

        // Renderizar hasta 3 tareas
        const top3 = recentTasks.slice(0, 3);
        top3.forEach(task => {
            recentTasksListEl.appendChild(createTaskElement(task, false));
        });

        // Renderizar el resto si hay más de 3
        if (recentTasks.length > 3) {
            moreRecentTasksContainerEl.style.display = 'block';
            const restTasks = recentTasks.slice(3);
            restTasks.forEach(task => {
                moreRecentTasksListEl.appendChild(createTaskElement(task, false));
            });
        } else {
            if (moreRecentTasksContainerEl) moreRecentTasksContainerEl.style.display = 'none';
        }
    }

    // 4. Añadir Tarea
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleInput = document.getElementById('newTaskTitle');
        const categoryInput = document.getElementById('newTaskCategory');
        const priorityInput = document.getElementById('newTaskPriority');

        const newTask = {
            id: Date.now().toString(),
            title: titleInput.value.trim(),
            category: categoryInput.value,
            priority: priorityInput.value
        };

        if (newTask.title !== '') {
            tasks.push(newTask);
            saveTasks();
            renderTasks();

            // Limpiar formulario
            titleInput.value = '';
            categoryInput.value = 'Trabajo';
            priorityInput.value = 'Alta';
        }
    });

    // 5. Eliminar Tarea
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const taskId = e.target.getAttribute('data-id');
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }
    });

    // 6. Búsqueda por texto (Tiempo real)
    searchInput.addEventListener('input', () => {
        renderTasks();
    });

    // 7. Filtro por categorías
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Actualizar botones activos
            categoryFilters.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            currentFilter = e.target.getAttribute('data-category');
            renderTasks();
        });
    });

    loadTasks();
});
