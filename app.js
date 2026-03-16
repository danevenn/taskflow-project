document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const clearAllBtn = document.getElementById('clearAllTasksBtn');
    const categoryFilters = document.querySelectorAll('.filter-btn');
    const statusFilters = document.querySelectorAll('.status-btn');
    const themeToggle = document.getElementById('themeToggle');
    const themeIconDark = document.getElementById('themeIconDark');
    const themeIconLight = document.getElementById('themeIconLight');
    const completeAllBtn = document.getElementById('completeAllTasksBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    /**
     * Mapa de peso por prioridad: mayor valor = más importante.
     * Se utiliza para ordenar las tareas mostradas.
     */
    const PRIORITY_ORDER = {
        Alta: 3,
        Media: 2,
        Baja: 1
    };

    let tasks = [];
    let currentFilter = 'Todas';
    let currentStatusFilter = 'Todos';

    /**
     * Inicializa el modo de tema (claro/oscuro) según `localStorage`
     * y las preferencias del sistema, y sincroniza los iconos del botón.
     */
    function initTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.getItem('theme');

        const useDark = storedTheme === 'dark' || (!storedTheme && prefersDark);

        document.documentElement.classList.toggle('dark', useDark);
        if (useDark) {
            themeIconLight.classList.remove('hidden');
            themeIconDark.classList.add('hidden');
        } else {
            themeIconDark.classList.remove('hidden');
            themeIconLight.classList.add('hidden');
        }
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');

        if (isDark) {
            themeIconDark.classList.add('hidden');
            themeIconLight.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIconLight.classList.add('hidden');
            themeIconDark.classList.remove('hidden');
            localStorage.setItem('theme', 'light');
        }
    });

    initTheme();

    /**
     * Carga las tareas persistidas en `localStorage`.
     * Si los datos están corruptos, limpia la clave y comienza con una lista vacía.
     */
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (!storedTasks) {
            renderTasks();
            return;
        }

        try {
            const parsed = JSON.parse(storedTasks);
            if (Array.isArray(parsed)) {
                tasks = parsed;
            }
        } catch (error) {
            console.error('No se pudieron leer las tareas desde localStorage. Se reinicia el estado.', error);
            localStorage.removeItem('tasks');
            tasks = [];
        }

        renderTasks();
    }

    /**
     * Guarda el estado actual de tareas en `localStorage`.
     */
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * Crea el elemento de lista (tarjeta) para una tarea concreta.
     *
     * @param {Object} task - Tarea a representar.
     * @param {string} task.id - Identificador único de la tarea.
     * @param {string} task.title - Título descriptivo de la tarea.
     * @param {string} task.category - Categoría asociada a la tarea.
     * @param {string} task.priority - Prioridad de la tarea (Alta, Media, Baja).
     * @param {number} [task.createdAt] - Marca de tiempo (ms) de creación.
     * @param {boolean} [showDeleteBtn=true] - Indica si se debe mostrar el botón de borrado.
     * @returns {HTMLLIElement} Elemento de lista listo para insertarse en el DOM.
     */
    function createTaskElement(task, showDeleteBtn = true) {
        const li = document.createElement('li');
        li.className = 'flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group';

        let badgeClass = 'bg-green-500 text-white'; // Baja
        if (task.priority === 'Alta') badgeClass = 'bg-red-500 text-white';
        else if (task.priority === 'Media') badgeClass = 'bg-amber-500 text-white';

        const mainContainer = document.createElement('div');
        mainContainer.className = 'flex-1 min-w-0 flex items-center gap-3';

        const parseBool = (val) => val === true || val === 'true';
        const isCompleted = parseBool(task.completed);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer toggle-completed-btn';
        checkbox.checked = isCompleted;
        checkbox.setAttribute('data-id', task.id);
        checkbox.setAttribute('aria-label', 'Marcar como completada');
        
        mainContainer.appendChild(checkbox);

        const titleSpan = document.createElement('span');
        titleSpan.className = `block truncate font-bold text-lg text-slate-800 dark:text-slate-100 transition-all ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`;
        titleSpan.textContent = task.title;
        mainContainer.appendChild(titleSpan);

        const metaContainer = document.createElement('div');
        metaContainer.className = 'flex items-center gap-3';

        const categorySpan = document.createElement('span');
        categorySpan.className = 'px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md truncate';
        categorySpan.textContent = task.category;
        metaContainer.appendChild(categorySpan);

        const prioritySpan = document.createElement('span');
        prioritySpan.className = `px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${badgeClass}`;
        prioritySpan.textContent = task.priority;
        metaContainer.appendChild(prioritySpan);

        if (showDeleteBtn) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ml-auto sm:ml-4';
            editBtn.setAttribute('data-id', task.id);
            editBtn.setAttribute('aria-label', 'Editar Tarea');

            const editIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            editIcon.setAttribute('class', 'w-4 h-4 pointer-events-none');
            editIcon.setAttribute('fill', 'none');
            editIcon.setAttribute('stroke', 'currentColor');
            editIcon.setAttribute('viewBox', '0 0 24 24');

            const editPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            editPath.setAttribute('stroke-linecap', 'round');
            editPath.setAttribute('stroke-linejoin', 'round');
            editPath.setAttribute('stroke-width', '2');
            editPath.setAttribute('d', 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z');

            editIcon.appendChild(editPath);
            editBtn.appendChild(editIcon);
            metaContainer.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none ml-2';
            deleteBtn.setAttribute('data-id', task.id);
            deleteBtn.setAttribute('aria-label', 'Eliminar Tarea');

            const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            deleteIcon.setAttribute('class', 'w-4 h-4 pointer-events-none');
            deleteIcon.setAttribute('fill', 'none');
            deleteIcon.setAttribute('stroke', 'currentColor');
            deleteIcon.setAttribute('viewBox', '0 0 24 24');

            const deletePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            deletePath.setAttribute('stroke-linecap', 'round');
            deletePath.setAttribute('stroke-linejoin', 'round');
            deletePath.setAttribute('stroke-width', '2');
            deletePath.setAttribute('d', 'M6 18L18 6M6 6l12 12');

            deleteIcon.appendChild(deletePath);
            deleteBtn.appendChild(deleteIcon);
            metaContainer.appendChild(deleteBtn);
        }

        li.appendChild(mainContainer);
        li.appendChild(metaContainer);

        return li;
    }

    /**
     * Aplica filtros y ordenación actuales y renderiza la lista de tareas.
     * También actualiza la sección de “Novedades”.
     */
    function renderTasks() {
        taskList.innerHTML = '';

        const searchTerm = searchInput.value.toLowerCase();

        const filteredTasks = tasks.filter(task => {
            const matchesCategory = currentFilter === 'Todas' || task.category === currentFilter;
            const matchesSearch = task.title.toLowerCase().includes(searchTerm);
            
            let matchesStatus = true;
            if (currentStatusFilter === 'Pendientes') {
                matchesStatus = !task.completed;
            } else if (currentStatusFilter === 'Completadas') {
                matchesStatus = !!task.completed;
            }

            return matchesCategory && matchesSearch && matchesStatus;
        });

        filteredTasks.sort((a, b) => {
            const priorityA = PRIORITY_ORDER[a.priority] || 0;
            const priorityB = PRIORITY_ORDER[b.priority] || 0;
            return priorityB - priorityA;
        });

        if (filteredTasks.length === 0) {
            const emptyState = document.createElement('li');
            emptyState.className = 'text-sm text-slate-500 dark:text-slate-400 italic';
            emptyState.textContent = 'No hay tareas que coincidan con los filtros actuales.';
            taskList.appendChild(emptyState);
        } else {
            filteredTasks.forEach(task => {
                taskList.appendChild(createTaskElement(task, true));
            });
        }

        updateNovedades();
    }

    /**
     * Actualiza la sección de “Novedades”, mostrando las tareas creadas
     * en los últimos 3 días, separando las 3 más recientes y el resto.
     */
    function updateNovedades() {
        const recentTasksCountEl = document.getElementById('recentTasksCount');
        const recentTasksListEl = document.getElementById('recentTasksList');
        const moreRecentTasksContainerEl = document.getElementById('moreRecentTasksContainer');
        const moreRecentTasksListEl = document.getElementById('moreRecentTasksList');

        if (!recentTasksCountEl || !recentTasksListEl) return;

        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);

        const recentTasks = tasks
            .filter(task => {
                const timestamp = typeof task.createdAt === 'number'
                    ? task.createdAt
                    : parseInt(task.id, 10);
                return !Number.isNaN(timestamp) && timestamp >= threeDaysAgo;
            })
            .sort((a, b) => {
                const timeA = typeof a.createdAt === 'number' ? a.createdAt : parseInt(a.id, 10);
                const timeB = typeof b.createdAt === 'number' ? b.createdAt : parseInt(b.id, 10);
                return (timeB || 0) - (timeA || 0);
            }); // Más recientes primero

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
            moreRecentTasksContainerEl.classList.remove('hidden');
            const restTasks = recentTasks.slice(3);
            restTasks.forEach(task => {
                moreRecentTasksListEl.appendChild(createTaskElement(task, false));
            });
        } else {
            if (moreRecentTasksContainerEl) {
                moreRecentTasksContainerEl.classList.add('hidden');
            }
        }
    }

    // 4. Añadir Tarea
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleInput = document.getElementById('newTaskTitle');
        const categoryInput = document.getElementById('newTaskCategory');
        const priorityInput = document.getElementById('newTaskPriority');

        const newTask = {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
            title: titleInput.value.trim(),
            category: categoryInput.value,
            priority: priorityInput.value,
            completed: false,
            createdAt: Date.now()
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

    // 5. Interactuar con las Tareas (Editar / Eliminar / Completar)
    taskList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const deleteBtn = e.target.closest('.delete-btn');
            const taskId = deleteBtn.getAttribute('data-id');
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        } else if (e.target.closest('.edit-btn')) {
            const editBtn = e.target.closest('.edit-btn');
            const taskId = editBtn.getAttribute('data-id');
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex > -1) {
                const currentTitle = tasks[taskIndex].title;
                const newTitle = prompt('Edita el título de la tarea:', currentTitle);
                
                if (newTitle !== null && newTitle.trim() !== '') {
                    tasks[taskIndex].title = newTitle.trim();
                    saveTasks();
                    renderTasks();
                }
            }
        } else if (e.target.classList.contains('toggle-completed-btn')) {
            const taskId = e.target.getAttribute('data-id');
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex > -1) {
                tasks[taskIndex].completed = e.target.checked;
                saveTasks();
                renderTasks();
            }
        }
    });

    // 6. Búsqueda por texto (Tiempo real)
    searchInput.addEventListener('input', () => {
        renderTasks();
    });

    // 7. Filtro por categorías
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Actualizar botones activos quitando la clase de estado activo personalizada de UI Tailwind
            categoryFilters.forEach(b => {
                b.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-600');
                b.classList.add('border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
            });

            // Establecer el estado activo del botón clickeado
            const targetBtn = e.target.closest('button');
            targetBtn.classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-600');
            targetBtn.classList.remove('border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');

            currentFilter = targetBtn.getAttribute('data-category');
            renderTasks();
        });
    });

    // 8. Filtro por Estado
    statusFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            statusFilters.forEach(b => {
                b.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-600');
                b.classList.add('border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');
            });

            const targetBtn = e.target.closest('button');
            targetBtn.classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-600');
            targetBtn.classList.remove('border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300');

            currentStatusFilter = targetBtn.getAttribute('data-status');
            renderTasks();
        });
    });

    // Iniciar con los filtros activos visualmente
    document.querySelector('.filter-btn[data-category="Todas"]').click();
    document.querySelector('.status-btn[data-status="Todos"]').click();

    // 9. Borrar Todas las Tareas
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (tasks.length === 0) {
                alert('No hay tareas para borrar.');
                return;
            }

            if (confirm('¿Estás seguro de que quieres borrar TODAS las tareas? Esta acción no se puede deshacer.')) {
                tasks = [];
                saveTasks();
                renderTasks();
            }
        });
    }

    // 10. Marcar todas como completadas
    if (completeAllBtn) {
        completeAllBtn.addEventListener('click', () => {
            if (tasks.length === 0) return;
            tasks.forEach(task => task.completed = true);
            saveTasks();
            renderTasks();
        });
    }

    // 11. Borrar tareas completadas
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', () => {
            const initialCount = tasks.length;
            tasks = tasks.filter(task => !task.completed);
            
            if (tasks.length === initialCount) {
                alert('No hay tareas completadas para borrar.');
                return;
            }

            saveTasks();
            renderTasks();
        });
    }

    loadTasks();
});
