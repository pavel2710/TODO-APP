// API Base URL
const API_URL = 'http://localhost:8000/api';

// State
let tasks = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
    setupDragAndDrop();
});

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('addTaskForm');
    form.addEventListener('submit', handleAddTask);

    const editForm = document.getElementById('editTaskForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditTask);
    }
}

// Load all tasks from API
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) throw new Error('Failed to load tasks');

        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showToast('Failed to load tasks', 'error');
    }
}

// Render tasks to the board
function renderTasks() {
    // Clear all columns
    document.getElementById('todoColumn').innerHTML = '';
    document.getElementById('inProgressColumn').innerHTML = '';
    document.getElementById('doneColumn').innerHTML = '';

    // Filter and render tasks by status
    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const doneTasks = tasks.filter(t => t.status === 'done');

    // Render tasks or empty state
    if (todoTasks.length === 0) {
        renderEmptyState('todoColumn');
    } else {
        todoTasks.forEach(task => renderTask(task, 'todoColumn'));
    }

    if (inProgressTasks.length === 0) {
        renderEmptyState('inProgressColumn');
    } else {
        inProgressTasks.forEach(task => renderTask(task, 'inProgressColumn'));
    }

    if (doneTasks.length === 0) {
        renderEmptyState('doneColumn');
    } else {
        doneTasks.forEach(task => renderTask(task, 'doneColumn'));
    }

    // Update counters
    document.getElementById('todoCount').textContent = todoTasks.length;
    document.getElementById('inProgressCount').textContent = inProgressTasks.length;
    document.getElementById('doneCount').textContent = doneTasks.length;
}

// Render empty state for a column
function renderEmptyState(columnId) {
    const column = document.getElementById(columnId);
    const emptyState = document.createElement('div');
    emptyState.className = 'text-center py-8 text-gray-400';
    emptyState.innerHTML = `
        <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <p class="text-sm">No tasks yet</p>
    `;
    column.appendChild(emptyState);
}

// Render a single task card
function renderTask(task, columnId) {
    const column = document.getElementById(columnId);
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-move';
    taskCard.setAttribute('data-task-id', task.id);
    taskCard.setAttribute('draggable', 'true');

    // Add drag event listeners
    taskCard.addEventListener('dragstart', handleDragStart);
    taskCard.addEventListener('dragend', handleDragEnd);

    taskCard.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <h4 class="font-semibold text-gray-800 flex-1 cursor-pointer hover:text-blue-600" onclick="openEditModal(${task.id})">${escapeHtml(task.title)}</h4>
            <div class="flex gap-1">
                <button onclick="openEditModal(${task.id})" class="text-blue-500 hover:text-blue-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </button>
                <button onclick="deleteTask(${task.id})" class="text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
        ${task.description ? `<p class="text-sm text-gray-600 mb-3">${escapeHtml(task.description)}</p>` : ''}
        <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">${formatDate(task.created_at)}</span>
            <div class="flex gap-2">
                ${task.status !== 'todo' ? `
                    <button onclick="moveTask(${task.id}, 'todo')" class="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
                        ← To Do
                    </button>
                ` : ''}
                ${task.status === 'todo' ? `
                    <button onclick="moveTask(${task.id}, 'in_progress')" class="text-xs px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors">
                        Start →
                    </button>
                ` : ''}
                ${task.status === 'in_progress' ? `
                    <button onclick="moveTask(${task.id}, 'done')" class="text-xs px-2 py-1 bg-green-500 text-white hover:bg-green-600 rounded transition-colors">
                        Complete →
                    </button>
                ` : ''}
                ${task.status === 'done' ? `
                    <button onclick="moveTask(${task.id}, 'in_progress')" class="text-xs px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded transition-colors">
                        ← Resume
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    column.appendChild(taskCard);
}

// Handle add task form submission
async function handleAddTask(e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();

    if (!title) {
        showToast('Please enter a task title', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description: description || null,
                status: 'todo'
            })
        });

        if (!response.ok) throw new Error('Failed to create task');

        const newTask = await response.json();
        tasks.push(newTask);
        renderTasks();

        // Clear form
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';

        showToast('Task added successfully!', 'success');
    } catch (error) {
        console.error('Error creating task:', error);
        showToast('Failed to create task', 'error');
    }
}

// Move task to different status
async function moveTask(taskId, newStatus) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Failed to update task');

        const updatedTask = await response.json();

        // Update task in local state
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = updatedTask;
            renderTasks();
        }

        showToast('Task moved successfully!', 'success');
    } catch (error) {
        console.error('Error updating task:', error);
        showToast('Failed to move task', 'error');
    }
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete task');

        // Remove task from local state
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();

        showToast('Task deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Failed to delete task', 'error');
    }
}

// Utility: Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;

    if (type === 'error') {
        toast.classList.remove('bg-green-500');
        toast.classList.add('bg-red-500');
    } else {
        toast.classList.remove('bg-red-500');
        toast.classList.add('bg-green-500');
    }

    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Utility: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Drag and Drop functionality (US-103)
let draggedTaskId = null;

function handleDragStart(e) {
    draggedTaskId = parseInt(e.target.getAttribute('data-task-id'));
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (e.target.classList.contains('column') || e.target.closest('.column')) {
        const column = e.target.classList.contains('column') ? e.target : e.target.closest('.column');
        column.classList.add('bg-blue-50');
    }
}

function handleDragLeave(e) {
    if (e.target.classList.contains('column') || e.target.closest('.column')) {
        const column = e.target.classList.contains('column') ? e.target : e.target.closest('.column');
        column.classList.remove('bg-blue-50');
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    const column = e.target.classList.contains('column') ? e.target : e.target.closest('.column');
    if (column) {
        column.classList.remove('bg-blue-50');

        const columnId = column.id;
        let newStatus;

        if (columnId === 'todoColumn') {
            newStatus = 'todo';
        } else if (columnId === 'inProgressColumn') {
            newStatus = 'in_progress';
        } else if (columnId === 'doneColumn') {
            newStatus = 'done';
        }

        if (newStatus && draggedTaskId) {
            moveTask(draggedTaskId, newStatus);
        }
    }

    return false;
}

// Setup drag and drop for columns
function setupDragAndDrop() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('dragenter', handleDragEnter);
        column.addEventListener('dragleave', handleDragLeave);
        column.addEventListener('drop', handleDrop);
    });
}

// Edit Task functionality (US-104)
function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById('editModal');
    const editTaskId = document.getElementById('editTaskId');
    const editTaskTitle = document.getElementById('editTaskTitle');
    const editTaskDescription = document.getElementById('editTaskDescription');

    editTaskId.value = task.id;
    editTaskTitle.value = task.title;
    editTaskDescription.value = task.description || '';

    modal.classList.remove('hidden');
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.add('hidden');
}

async function handleEditTask(e) {
    e.preventDefault();

    const taskId = parseInt(document.getElementById('editTaskId').value);
    const title = document.getElementById('editTaskTitle').value.trim();
    const description = document.getElementById('editTaskDescription').value.trim();

    if (!title) {
        showToast('Please enter a task title', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description: description || null
            })
        });

        if (!response.ok) throw new Error('Failed to update task');

        const updatedTask = await response.json();

        // Update task in local state
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            tasks[index] = updatedTask;
            renderTasks();
        }

        closeEditModal();
        showToast('Task updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating task:', error);
        showToast('Failed to update task', 'error');
    }
}
