document.addEventListener("DOMContentLoaded", function () {
  const itemName = document.querySelector('input[type="text"]');
  const itemDate = document.querySelector('input[type="date"]');
  const itemPriority = document.querySelector("select");
  const addButton = document.querySelector("button");

  const presentTask = document.getElementById("todayTasks");
  const futureTask = document.getElementById("futureTasks");
  const pastTask = document.getElementById("completedTasks");

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getTasks = () => {
    return JSON.parse(localStorage.getItem("todayList")) || [];
  };

  const saveTasks = (tasks) => {
    localStorage.setItem("todayList", JSON.stringify(tasks));
  };

  const clearUI = () => {
    presentTask.innerHTML = "";
    futureTask.innerHTML = "";
    pastTask.innerHTML = "";
  };
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };
  const createTaskItem = (task, displayIndex, index) => {
    const ul = document.createElement("ul");

    const nameLi = document.createElement("li");
    const today = getTodayDate();
    if (task.completed || task.date < today) {
      nameLi.textContent = `✅ ${displayIndex}. ${task.name}`;
      nameLi.style.textDecoration = "line-through";
    } else {
      nameLi.textContent = `${displayIndex}. ${task.name}`;
    }

    const dateLi = document.createElement("li");
    dateLi.textContent = formatDate(task.date);

    const priorityLi = document.createElement("li");
    priorityLi.textContent = `${task.priority}`;

    const iconLi = document.createElement("li");
    iconLi.classList.add("icon-list");

    if (!task.completed) {
      const checkImg = document.createElement("img");
      checkImg.src = "./image/check-circle 1.png";
      checkImg.style.cursor = "pointer";
      checkImg.addEventListener("click", () => toggleComplete(index));
      iconLi.appendChild(checkImg);
    }
    const trashImg = document.createElement("img");
    trashImg.src = "./image/trash 1.png";
    trashImg.style.cursor = "pointer";
    trashImg.addEventListener("click", () => deleteTask(index));
    iconLi.appendChild(trashImg);

    ul.appendChild(nameLi);
    ul.appendChild(dateLi);
    ul.appendChild(priorityLi);
    ul.appendChild(iconLi);

    return ul;
  };

  const renderTask = () => {
    clearUI();
    const tasks = getTasks();
    const today = getTodayDate();
    let todayCount = 1;
    let futureCount = 1;
    let completedCount = 1;
    tasks.forEach((task, index) => {
      // createTaskItem(task, index)
      let taskElement;
      if (task.completed || task.date < today) {
        taskElement = createTaskItem(task, completedCount, index);
        task.completed = true;
        pastTask.appendChild(taskElement);
        completedCount++;
      } else if (task.date === today) {
        taskElement = createTaskItem(task, todayCount, index);
        presentTask.appendChild(taskElement);
        todayCount++;
      } else {
        taskElement = createTaskItem(task, futureCount, index);
        futureTask.appendChild(taskElement);
        futureCount++;
      }
    });
  };

  addButton.addEventListener("click", () => {
    const name = itemName.value.trim();
    const date = itemDate.value;
    const priority = itemPriority.value;

    if (!name || !date || priority === "priority") {
      alert("Please fill all fields correctly!");
      return;
    }

    const newTask = { name, date, priority, completed: false };
    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);
    renderTask();

    itemName.value = "";
    itemDate.value = "";
    itemPriority.selectedIndex = 0;
  });

  const toggleComplete = (index) => {
    const tasks = getTasks();
    if (tasks[index].completed) return; // Don't allow toggling back
    tasks[index].completed = true;
    saveTasks(tasks);
    renderTask();
  };

  const deleteTask = (index) => {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTask();
  };

  renderTask();
});
