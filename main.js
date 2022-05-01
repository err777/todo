/*
    Залить на гитхаб

    Открывать модалку при клике на редактировать
    Вызывать функцию редактирования при клике на confirm
    Написать функцию редактирования по ID, передавать аргументами: тест, ID

    Вынести модалку в отдельный элемент
    Работа с координатами (получить, привязать модалку к координатам, позиционирование CSS)
     
 */

const addInput = document.getElementById("add__input");
const addButton = document.getElementById("add__button");
const tasksWrapper = document.getElementById("tasks__wrapper");

let list = !localStorage.tasks ? [] : JSON.parse(localStorage.getItem("tasks"));

function Task(taskContent) {
  this.taskContent = taskContent;
  this.completed = false;
  this.id = Date.now();
}

const setTasksToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(list));
};

const addTaskToListAndLocalStorage = () => {
  if (addInput.value.length) {
    const task = new Task(addInput.value);
    list.push(task);
    setTasksToLocalStorage();
    editList();
    addInput.value = "";
  }
};

const createTaskElement = (task) => {
  const taskElement = document.createElement("div");
  taskElement.innerHTML = `
        <div id="${task.id}" class="task ${
    task.completed ? "task--checked" : ""
  }">
            <input class="task__checkbox" type="checkbox" ${
              task.completed ? "checked" : ""
            }>
            <div class="task__text">${task.taskContent}</div>
            <button  class="task__button task__button--edit">edit</button>
            <button class="task__button task__button--delete">del</button>
            <div class="task__modal modal modal--hidden">
                <input class="modal__input" type="text" placeholder="You can edit your task here">
                <button class="modal__confirm">confirm</button>
            </div>
        </div>
    `;
  return taskElement;
};

// console.log(createTaskElement());

const deleteTask = (id) => {
  list = list.filter((task) => task.id !== id);
  setTasksToLocalStorage();
  editList();
};

// console.log(list);

const editTask = (taskElement, id) => {
  // const task = list.find((task) => task.id === id)
  console.log(taskElement);
  setTasksToLocalStorage();
  editList();
  //
  // modal.classlist.toggle('modal--hidden')
  // console.log(task);
};

const completeTask = (id) => {
  const task = list.find((task) => task.id === id);
  task.completed = !task.completed;
  setTasksToLocalStorage();
  editList();
};

const addEventListenersToTaskItem = (taskElement, task) => {
  const deleteButton = taskElement.querySelector(".task__button--delete");
  const editButton = taskElement.querySelector(".task__button--edit");
  const completeButton = taskElement.querySelector(".task__checkbox");
  // console.log(taskElement);

  deleteButton.addEventListener("click", () => deleteTask(task.id));
  editButton.addEventListener("click", () => editTask(taskElement, task.id));
  completeButton.addEventListener("click", () => completeTask(task.id));
};

const createTask = (task, index) => {
  const taskElement = createTaskElement(task, index);
  addEventListenersToTaskItem(taskElement, task);
  tasksWrapper.appendChild(taskElement);
};

const editList = () => {
  tasksWrapper.innerHTML = "";
  if (list.length > 0) {
    list.forEach((task, index) => {
      createTask(task, index);
    });
  }
};

editList();

addButton.addEventListener("click", addTaskToListAndLocalStorage);
