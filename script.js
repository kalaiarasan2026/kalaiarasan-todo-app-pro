
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#dc2626" : "#16a34a";

  setTimeout(() => {
    message.textContent = "";
  }, 2000);
}

function updateTaskCount() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  taskCount.textContent = `${completed} / ${total} completed`;
}

function getFilteredTasks() {
  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  if (currentFilter === "pending") {
    return tasks.filter((task) => !task.completed);
  }

  return tasks;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();
  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li class="empty-state">No tasks found.</li>`;
    updateTaskCount();
    return;
  }

  filteredTasks.forEach((task) => {
    const originalIndex = tasks.findIndex(
      (item) => item.id === task.id
    );

    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" class="complete-checkbox" data-id="${task.id}" ${
      task.completed ? "checked" : ""
    } />
        <div class="task-content">
          <span class="task-text ${task.completed ? "completed" : ""}">
            ${task.text}
          </span>
        </div>
      </div>
      <div class="task-actions">
        <button class="action-btn edit-btn" data-index="${originalIndex}">Edit</button>
        <button class="action-btn delete-btn" data-index="${originalIndex}">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  addEventListeners();
  updateTaskCount();
}

function addEventListeners() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  const editButtons = document.querySelectorAll(".edit-btn");
  const checkboxes = document.querySelectorAll(".complete-checkbox");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteTask);
  });

  editButtons.forEach((button) => {
    button.addEventListener("click", editTask);
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", toggleTask);
  });
}

function addTask() {
  const taskText = taskInput.value.trim();

  if (!taskText) {
    showMessage("Please enter a task", true);
    return;
  }

  tasks.push({
    id: Date.now(),
    text: taskText,
    completed: false,
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
  showMessage("Task added successfully");
}

function deleteTask(event) {
  const index = Number(event.target.getAttribute("data-index"));
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  showMessage("Task deleted");
}

function editTask(event) {
  const index = Number(event.target.getAttribute("data-index"));
  const updatedText = prompt("Edit your task:", tasks[index].text);

  if (updatedText === null) {
    return;
  }

  const trimmedText = updatedText.trim();

  if (!trimmedText) {
    showMessage("Task cannot be empty", true);
    return;
  }

  tasks[index].text = trimmedText;
  saveTasks();
  renderTasks();
  showMessage("Task updated");
}

function toggleTask(event) {
  const taskId = Number(event.target.getAttribute("data-id"));
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.getAttribute("data-filter");
    renderTasks();
  });
});

renderTasks();
