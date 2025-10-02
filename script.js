// To-Do List Application with Projects
class TodoApp {
    constructor() {
        this.tasks = [];
        this.projects = [];
        this.currentProject = 'all'; // Default to showing all tasks
        
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.projectInput = document.getElementById('projectInput');
        this.addProjectBtn = document.getElementById('addProjectBtn');
        this.projectSelect = document.getElementById('projectSelect');
        this.projectsList = document.getElementById('projectsList');
        this.allTasksCount = document.getElementById('allTasksCount');
        
        this.initEventListeners();
        this.loadTasks();
        this.loadProjects();
        this.updateProjectSelect();
        this.updateProjectsList();
        this.updateTaskCounts();
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
        
        // Add project when button is clicked
        this.addProjectBtn.addEventListener('click', () => {
            this.addProject();
        });
        
        // Add project when Enter key is pressed in the project input field
        this.projectInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addProject();
            }
        });
        
        // Project selection change
        this.projectSelect.addEventListener('change', (e) => {
            this.currentProject = e.target.value;
            this.renderTasks();
            this.updateActiveProject();
        });
    }
    
    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
        
        const selectedProject = this.projectSelect.value || 'all';
        
        const task = {
            id: Date.now(), // Unique ID based on timestamp
            text: taskText,
            completed: false,
            projectId: selectedProject,
            createdAt: new Date()
        };
        
        this.tasks.push(task);
        this.taskInput.value = ''; // Clear input
        this.saveTasks();
        this.updateTaskCounts();
        this.renderTasks();
    }
    
    addProject() {
        const projectName = this.projectInput.value.trim();
        
        if (projectName === '') {
            alert('Please enter a project name!');
            return;
        }
        
        // Check if project already exists
        if (this.projects.some(project => project.name === projectName)) {
            alert('A project with this name already exists!');
            return;
        }
        
        const project = {
            id: Date.now(), // Unique ID based on timestamp
            name: projectName,
            createdAt: new Date()
        };
        
        this.projects.push(project);
        this.projectInput.value = ''; // Clear input
        this.saveProjects();
        this.updateProjectSelect();
        this.updateProjectsList();
    }
    
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.updateTaskCounts();
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
        this.updateTaskCounts();
        this.renderTasks();
    }
    
    switchProject(projectId) {
        this.currentProject = projectId;
        this.renderTasks();
        this.updateActiveProject();
    }
    
    updateActiveProject() {
        // Remove active class from all projects
        const projectItems = this.projectsList.querySelectorAll('.project-item');
        projectItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to the current project
        const currentProjectItem = this.projectsList.querySelector(`[data-project="${this.currentProject}"]`);
        if (currentProjectItem) {
            currentProjectItem.classList.add('active');
        }
        
        // Update the dropdown as well
        this.projectSelect.value = this.currentProject;
    }
    
    editProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const newName = prompt('Enter new project name:', project.name);
        if (newName !== null && newName.trim() !== '') {
            // Check if project name already exists
            if (this.projects.some(p => p.id !== projectId && p.name === newName.trim())) {
                alert('A project with this name already exists!');
                return;
            }
            
            project.name = newName.trim();
            this.saveProjects();
            this.updateProjectSelect();
            this.updateProjectsList();
        }
    }
    
    deleteProject(projectId) {
        // Confirm deletion
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const confirmDelete = confirm(`Are you sure you want to delete the project "${project.name}"?\nAll tasks in this project will be moved to "All Tasks".`);
        if (!confirmDelete) return;
        
        // Move tasks from this project to 'all' project
        this.tasks = this.tasks.map(task => {
            if (task.projectId === projectId) {
                return {...task, projectId: 'all'};
            }
            return task;
        });
        
        // Remove the project
        this.projects = this.projects.filter(p => p.id !== projectId);
        
        // Save changes
        this.saveProjects();
        this.saveTasks();
        
        // Update UI - if currently viewing the deleted project, switch to 'all'
        if (this.currentProject === projectId) {
            this.currentProject = 'all';
        }
        
        this.updateProjectSelect();
        this.updateProjectsList();
        this.updateTaskCounts();
        this.renderTasks();
        this.updateActiveProject();
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
    
    saveProjects() {
        localStorage.setItem('todoProjects', JSON.stringify(this.projects));
    }
    
    loadProjects() {
        const savedProjects = localStorage.getItem('todoProjects');
        if (savedProjects) {
            this.projects = JSON.parse(savedProjects);
        } else {
            // Default projects
            this.projects = [
                { id: 'work', name: 'Work', createdAt: new Date() },
                { id: 'personal', name: 'Personal', createdAt: new Date() },
                { id: 'shopping', name: 'Shopping', createdAt: new Date() }
            ];
            this.saveProjects();
        }
    }
    
    updateProjectSelect() {
        // Clear existing options except the first one
        while (this.projectSelect.options.length > 1) {
            this.projectSelect.remove(1);
        }
        
        // Add project options
        this.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            this.projectSelect.appendChild(option);
        });
    }
    
    updateProjectsList() {
        // Clear existing project items except the first one (All Tasks)
        while (this.projectsList.children.length > 1) {
            this.projectsList.removeChild(this.projectsList.lastChild);
        }
        
        // Add project items
        this.projects.forEach(project => {
            const projectItem = document.createElement('li');
            projectItem.className = `project-item ${this.currentProject === project.id ? 'active' : ''}`;
            projectItem.setAttribute('data-project', project.id);
            projectItem.innerHTML = `
                <div class="project-info">
                    <span class="project-name">${project.name}</span>
                    <span class="task-count" id="project-${project.id}-count">0</span>
                </div>
                <div class="project-actions">
                    <button class="edit-project-btn" onclick="todoApp.editProject('${project.id}')">Edit</button>
                    <button class="delete-project-btn" onclick="todoApp.deleteProject('${project.id}')">Del</button>
                </div>
            `;
            
            // Add click event to switch project (only on the project name/info, not buttons)
            const projectInfo = projectItem.querySelector('.project-info');
            projectInfo.addEventListener('click', () => {
                this.switchProject(project.id);
            });
            
            this.projectsList.appendChild(projectItem);
        });
        
        // Ensure the active project is highlighted
        this.updateActiveProject();
    }
    
    updateTaskCounts() {
        // Count all tasks
        const allTasksCount = this.tasks.length;
        this.allTasksCount.textContent = allTasksCount;
        
        // Count tasks for each project
        this.projects.forEach(project => {
            const projectTaskCount = this.tasks.filter(task => task.projectId === project.id).length;
            const countElement = document.getElementById(`project-${project.id}-count`);
            if (countElement) {
                countElement.textContent = projectTaskCount;
            }
        });
    }
    
    renderTasks() {
        // Clear the task list
        this.taskList.innerHTML = '';
        
        // Filter tasks based on current project
        let filteredTasks = this.tasks;
        if (this.currentProject !== 'all') {
            filteredTasks = this.tasks.filter(task => task.projectId === this.currentProject);
        }
        
        // Show empty state if no tasks
        if (filteredTasks.length === 0) {
            this.taskList.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks in this project!</h3>
                    <p>Add a new task to get started.</p>
                </div>
            `;
            return;
        }
        
        // Add each task to the list
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            // Find project name for display
            const project = this.projects.find(p => p.id === task.projectId);
            const projectName = project ? project.name : 'General';
            
            taskItem.innerHTML = `
                <span class="task-text">${task.text} <span class="task-project">(${projectName})</span></span>
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