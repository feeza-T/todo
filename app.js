document.addEventListener("DOMContentLoaded", ()=>{
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if(storedTasks){
        storedTasks.forEach((task)=> tasks.push(task));
        updateTasksList();
        updateStats();
    }

    setTimeout(function(){
        document.querySelector('.starting-page').style.display = 'none';
        document.querySelector('.container').style.display = 'flex';
    }, 5000);
});

let tasks = [];

const saveTasks = ()=>{    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();  
    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;  
    updateTasksList();
    updateStats();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;

    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

const clearAllTasks = () => {
    tasks = [];
    updateTasksList();
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;  
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completeTasks / totalTasks) * 100 : 0;
    const progressBar = document.getElementById('progress');

    progressBar.style.width = `${progress}%`;
    document.getElementById('numbers').innerText = `${completeTasks} / ${totalTasks}`;

    if(tasks.length && completeTasks === totalTasks) {
        blashConfetti();
    }
};

const updateTasksList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.draggable = true;
        listItem.classList.add("taskItem");
        listItem.dataset.index = index;

        listItem.innerHTML = `
        <div class="task ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
            <p>${task.text}</p>
        </div>
        <div class="icons">
            <i class="fa-regular fa-pen-to-square" onclick="editTask(${index})"></i>
            <i class="fa-solid fa-trash" onclick="deleteTask(${index})"></i>
        </div>
        `;

        listItem.querySelector(".checkbox").addEventListener("change", () => toggleTaskComplete(index));
        taskList.append(listItem);
    });

    addDragAndDrop();
};

const addDragAndDrop = () => {
    const taskList = document.getElementById('task-list');
    const taskItems = taskList.querySelectorAll('.taskItem');

    taskItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    });
};

const handleDragStart = (e) => {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
};

const handleDragOver = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const taskList = document.getElementById('task-list');
    const taskItems = Array.from(taskList.querySelectorAll('.taskItem:not(.dragging)'));

    const nextItem = taskItems.find(item => {
        const rect = item.getBoundingClientRect();
        return e.clientY < rect.top + rect.height / 2;
    });

    taskList.insertBefore(draggingItem, nextItem);
};

const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    updateTaskOrder();
};

const handleDrop = (e) => {
    e.preventDefault();
};

const updateTaskOrder = () => {
    const taskList = document.getElementById('task-list');
    const taskItems = taskList.querySelectorAll('.taskItem');

    tasks = Array.from(taskItems).map((item, index) => {
        const indexData = item.dataset.index;
        return tasks[indexData];
    });

    saveTasks();
    updateTasksList();
};

document.getElementById("taskForm").addEventListener('submit', function (e) {
    e.preventDefault();
    addTask();
});

document.getElementById("clearAll").addEventListener('click', clearAllTasks);

const blashConfetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}
