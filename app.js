document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilters = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('themeToggle');
    const themeIconDark = document.getElementById('themeIconDark');
    const themeIconLight = document.getElementById('themeIconLight');

    let tasks = [];
    let currentFilter = 'Todas';

    // 0. Lógica del Modo Oscuro
    function initTheme() {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            themeIconLight.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            themeIconDark.classList.remove('hidden');
        }
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');

        if (isDark) {
            themeIconDark.classList.add('hidden');
            themeIconLight.classList.remove('hidden');
            localStorage.theme = 'dark';
        } else {
            themeIconLight.classList.add('hidden');
            themeIconDark.classList.remove('hidden');
            localStorage.theme = 'light';
        }
    });

    initTheme();

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

    function createTaskElement(task, showDeleteBtn = true) {
        const li = document.createElement('li');
        li.className = 'flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group';

        let badgeClass = 'bg-green-500 text-white'; // Baja
        if (task.priority === 'Alta') badgeClass = 'bg-red-500 text-white';
        else if (task.priority === 'Media') badgeClass = 'bg-amber-500 text-white';

        let deleteBtnHTML = showDeleteBtn ? `<button class="delete-btn w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none ml-auto" data-id="${task.id}" aria-label="Eliminar Tarea">
            <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>` : '';

        li.innerHTML = `
            <div class="flex-1 min-w-0">
                <span class="block truncate font-bold text-lg text-slate-800 dark:text-slate-100">${task.title}</span>
            </div>
            <div class="flex items-center gap-3">
                <span class="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md truncate">${task.category}</span>
                <span class="px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${badgeClass}">${task.priority}</span>
                ${deleteBtnHTML}
            </div>
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

    // Iniciar con el filtro "Todas" activo visualmente
    document.querySelector('[data-category="Todas"]').click();

    loadTasks();
});
