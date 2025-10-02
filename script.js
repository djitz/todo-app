// To-Do List Application
class TodoApp {
    constructor() {
        this.tasks = [];
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        
        this.initEventListeners();
        this.loadTasks();
        this.renderTasks();
    }
    
    initEventListeners() {
        // Add task when button is clicked
        this.addBtn.addEventListener('click', () => {
            this.addTask();
        });
        
        // Add task when Enter key is pressed in the input field
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
    }
    
    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
        
        const task = {
            id: Date.now(), // Unique ID based on timestamp
            text: taskText,
            completed: false,
            createdAt: new Date()
        };
        
        this.tasks.push(task);
        this.taskInput.value = ''; // Clear input
        this.saveTasks();
        this.renderTasks();
    }
    
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }
    
    toggleComplete(id) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                return {...task, completed: !task.completed};
            }
            return task;
        });
        this.saveTasks();
        this.renderTasks();
    }
    
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }
    
    loadTasks() {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }
    
    renderTasks() {
        // Clear the task list
        this.taskList.innerHTML = '';
        
        // Show empty state if no tasks
        if (this.tasks.length === 0) {
            this.taskList.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks yet!</h3>
                    <p>Add your first task to get started.</p>
                </div>
            `;
            return;
        }
        
        // Add each task to the list
        this.tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn ${task.completed ? 'completed' : ''}" 
                            onclick="todoApp.toggleComplete(${task.id})">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})">
                        Delete
                    </button>
                </div>
            `;
            this.taskList.appendChild(taskItem);
        });
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});