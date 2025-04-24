document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  saveTask(task);
  renderTask(task);
  taskInput.value = "";
}

function renderTask(task) {
  const list = document.getElementById("taskList");
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);
  li.className = task.completed ? "completed" : "";

  li.innerHTML = `
    ${task.text}
    <div class="actions">
      <button onclick="toggleTask(${task.id})">✅</button>
      <button onclick="deleteTask(${task.id})">❌</button>
    </div>
  `;

  list.appendChild(li);
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(renderTask);
}

function toggleTask(id) {
  let tasks = getTasks();
  tasks = tasks.map(task => {
    if (task.id === id) task.completed = !task.completed;
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  refreshTasks();
}

function deleteTask(id) {
  let tasks = getTasks().filter(task => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  refreshTasks();
}

function refreshTasks() {
  document.getElementById("taskList").innerHTML = "";
  loadTasks();
}
