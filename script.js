// Wait for the DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', function () {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Array to hold tasks in memory (keeps in sync with localStorage)
    let tasks = [];

    // Helper: save the current tasks array to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Helper: create a task <li> with a Remove button and append to the DOM
    // This does NOT modify the tasks array or localStorage (so it can be used
    // both when loading existing tasks and when adding new ones).
    function createTaskElement(taskText) {
        const li = document.createElement('li');
        li.textContent = taskText; // set the visible text for the task

        // Create the remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';

        // Use classList.add() as required
        removeButton.classList.add('remove-btn');

        // When clicked, remove the <li> from the DOM and update localStorage
        removeButton.addEventListener('click', function () {
            // Remove the element from the page
            taskList.removeChild(li);

            // Remove the task from the tasks array (removes the first matching entry)
            const index = tasks.indexOf(taskText);
            if (index > -1) {
                tasks.splice(index, 1);
                saveTasks(); // persist the change
            }
        });

        // Append the remove button and the li to the list
        li.appendChild(removeButton);
        taskList.appendChild(li);
    }

    /**
     * Add a task.
     * @param {string|null} taskTextArg - If provided, use this text; otherwise read from input.
     * @param {boolean} save - If true, push the task into tasks array and save to localStorage.
     */
    function addTask(taskTextArg = null, save = true) {
        // Determine the task text either from the argument or from the input field
        const taskText = (taskTextArg !== null) ? taskTextArg : taskInput.value.trim();

        // Prevent empty tasks
        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }

        // Create and append the task element to the DOM
        createTaskElement(taskText);

        // If requested, update the tasks array and persist it
        if (save) {
            tasks.push(taskText);
            saveTasks();
        }

        // Clear the input field for convenience
        taskInput.value = "";
    }

    // Load tasks from localStorage and populate the UI
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        // Initialize the in-memory tasks array to what's in storage
        tasks = storedTasks;
        // Create DOM elements for each stored task (do not save again)
        storedTasks.forEach(taskText => createTaskElement(taskText));
    }

    // Event listeners for adding tasks
    addButton.addEventListener('click', function () {
        addTask(); // read from input and save
    });

    // Allow pressing Enter to add a task
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Initial load of tasks from localStorage
    loadTasks();
});
