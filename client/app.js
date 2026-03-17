import * as api from './src/api/client.js';

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
    const recentTasksList = document.getElementById('recentTasksList');
    const moreRecentTasksList = document.getElementById('moreRecentTasksList');
    const loadingState = document.getElementById('loadingState');
    const statusMessage = document.getElementById('statusMessage');

    const PRIORITY_ORDER = {
        Alta: 3,
        Media: 2,
        Baja: 1
    };

    let tasks = [];
    let currentFilter = 'Todas';
    let currentStatusFilter = 'Todos';

    // UI State Helpers
    function showLoading(show) {
        if (show) {
            loadingState.classList.remove('hidden');
            taskList.classList.add('hidden');
        } else {
            loadingState.classList.add('hidden');
            taskList.classList.remove('hidden');
        }
    }

    function showStatus(message, type = 'success') {
        statusMessage.textContent = message;
        statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
        
        if (type === 'success') {
            statusMessage.classList.add('bg-green-100', 'text-green-800');
        } else {
            statusMessage.classList.add('bg-red-100', 'text-red-800');
        }

        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    }

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
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeIconDark.classList.toggle('hidden');
        themeIconLight.classList.toggle('hidden');
    });

    initTheme();

    async function loadTasks() {
        showLoading(true);
        try {
            tasks = await api.getTasks();
            renderTasks();
        } catch (error) {
            console.error(error);
            showStatus('Fallo al cargar las tareas del servidor.', 'error');
        } finally {
            showLoading(false);
        }
    }

    function createTaskElement(task, showDeleteBtn = true) {
        const isCompleted = task.completed === true;
        const badgeClass = task.priority === 'Alta' ? 'bg-red-500 text-white' : 
                          task.priority === 'Media' ? 'bg-amber-500 text-white' : 
                          'bg-green-500 text-white';

        const li = document.createElement('li');
        li.className = 'flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group';
        
        li.innerHTML = `
            <div class="flex-1 min-w-0 flex items-center gap-3">
                <input type="checkbox" 
                       class="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer toggle-completed-btn" 
                       data-id="${task.id}" 
                       ${isCompleted ? 'checked' : ''} 
                       aria-label="Marcar como completada">
                <span class="block truncate font-bold text-lg text-slate-800 dark:text-slate-100 transition-all ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}">
                    ${task.title}
                </span>
            </div>
            <div class="flex items-center gap-3">
                <span class="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md truncate">
                    ${task.category}
                </span>
                <span class="px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${badgeClass}">
                    ${task.priority}
                </span>
                ${showDeleteBtn ? `
                    <button class="delete-btn w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors ml-2" 
                            data-id="${task.id}" 
                            aria-label="Eliminar Tarea">
                        <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                ` : ''}
            </div>
        `;
        return li;
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();

        const filteredTasks = tasks.filter(task => {
            const matchesCategory = currentFilter === 'Todas' || task.category === currentFilter;
            const matchesSearch = task.title.toLowerCase().includes(searchTerm);
            let matchesStatus = true;
            if (currentStatusFilter === 'Pendientes') matchesStatus = !task.completed;
            else if (currentStatusFilter === 'Completadas') matchesStatus = !!task.completed;
            return matchesCategory && matchesSearch && matchesStatus;
        });

        filteredTasks.sort((a, b) => (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0));

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<li class="text-sm text-slate-500 dark:text-slate-400 italic">No hay tareas.</li>';
        } else {
            filteredTasks.forEach(task => taskList.appendChild(createTaskElement(task, true)));
        }

        updateNovedades();
    }

    function updateNovedades() {
        const countEl = document.getElementById('recentTasksCount');
        const listEl = document.getElementById('recentTasksList');
        const containerEl = document.getElementById('moreRecentTasksContainer');
        const moreListEl = document.getElementById('moreRecentTasksList');

        if (!countEl || !listEl) return;

        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
        const recentTasks = tasks
            .filter(t => t.createdAt >= threeDaysAgo)
            .sort((a, b) => b.createdAt - a.createdAt);

        countEl.textContent = recentTasks.length;
        listEl.innerHTML = '';
        if (moreListEl) moreListEl.innerHTML = '';

        recentTasks.slice(0, 3).forEach(task => listEl.appendChild(createTaskElement(task, false)));

        if (recentTasks.length > 3) {
            containerEl.classList.remove('hidden');
            recentTasks.slice(3).forEach(task => moreListEl.appendChild(createTaskElement(task, false)));
        } else {
            containerEl?.classList.add('hidden');
        }
    }

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('newTaskTitle').value.trim();
        const category = document.getElementById('newTaskCategory').value;
        const priority = document.getElementById('newTaskPriority').value;

        if (!title) return;

        try {
            const newTask = await api.createTask({ title, category, priority });
            tasks.push(newTask);
            renderTasks();
            taskForm.reset();
            showStatus('Tarea creada con éxito');
        } catch (error) {
            showStatus(error.message, 'error');
        }
    });

    async function handleTaskInteraction(e) {
        const taskId = e.target.closest('button, input')?.getAttribute('data-id');
        if (!taskId) return;

        if (e.target.closest('.delete-btn')) {
            try {
                await api.deleteTask(taskId);
                tasks = tasks.filter(t => t.id !== taskId);
                renderTasks();
                showStatus('Tarea eliminada');
            } catch (error) {
                showStatus(error.message, 'error');
            }
        } else if (e.target.classList.contains('toggle-completed-btn')) {
            // Note: The backend doesn't have a PATCH/PUT yet, so this only stays local
            // until we refresh. This is a good point for future expansion.
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = e.target.checked;
                renderTasks();
            }
        }
    }

    taskList.addEventListener('click', handleTaskInteraction);
    [recentTasksList, moreRecentTasksList].forEach(el => el?.addEventListener('click', handleTaskInteraction));

    searchInput.addEventListener('input', renderTasks);

    categoryFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryFilters.forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));
            const target = e.target.closest('button');
            target.classList.add('active', 'bg-blue-600', 'text-white');
            currentFilter = target.getAttribute('data-category');
            renderTasks();
        });
    });

    statusFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            statusFilters.forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));
            const target = e.target.closest('button');
            target.classList.add('active', 'bg-blue-600', 'text-white');
            currentStatusFilter = target.getAttribute('data-status');
            renderTasks();
        });
    });

    clearAllBtn?.addEventListener('click', () => {
        showStatus('Lógica de borrado masivo no implementada en API todavía', 'error');
    });

    completeAllBtn?.addEventListener('click', () => {
        tasks.forEach(t => t.completed = true);
        renderTasks();
    });

    clearCompletedBtn?.addEventListener('click', () => {
        showStatus('Lógica de borrado masivo no implementada en API todavía', 'error');
    });

    loadTasks();
});
