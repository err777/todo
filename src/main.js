/*
  + Инициализация проекта
  + Залить на гитхаб

  + Открывать модалку при клике на редактировать
  + Вызывать функцию редактирования при клике на confirm
  + Написать функцию редактирования по ID, передавать аргументами: тест, ID

  + Вынести модалку в отдельный элемент
*/

fetch('https://jsonplaceholder.typicode.com/todos')
  .then((response) => response.json())
  .then((json) => console.log(json))

const addInput = document.getElementById('add__input')
const addButton = document.getElementById('add__button')
const tasksWrapper = document.getElementById('tasks__wrapper')

let list = !localStorage.tasks ? [] : JSON.parse(localStorage.getItem('tasks'))
let editTaskModal = null

function Task(text) {
  this.text = text
  this.completed = false
  this.id = Date.now()
}

const setTasksToLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(list))
}

const addTaskToListAndLocalStorage = () => {
  if (addInput.value.length) {
    const task = new Task(addInput.value)
    list.push(task)
    setTasksToLocalStorage()
    editList()
    addInput.value = ''
  }
}

const createTaskElement = (task) => {
  const taskElement = document.createElement('div')
  taskElement.className = `task ${task.completed ? 'task--checked' : ''}`
  taskElement.setAttribute('id', task.id)
  taskElement.innerHTML = `
      <input class="task__checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
      <div class="task__text">${task.text}</div>
      <button  class="task__button task__button--edit">edit</button>
      <button class="task__button task__button--delete">del</button>
    `
  return taskElement
}

const createModalElement = () => {
  const modalElement = document.createElement('div')
  modalElement.className = 'task__modal modal'
  modalElement.innerHTML = `
      <input class="modal__input" type="text" placeholder="You can edit your task here">
      <button class="modal__confirm">confirm</button>
    `
  return modalElement
}

const deleteTask = (id) => {
  list = list.filter((task) => task.id !== id)
  setTasksToLocalStorage()
  editList()
}

const editTask = (taskElement) => {
  const task = list.find((task) => task.id === +taskElement.id)
  const input = taskElement.querySelector('.modal__input')
  task.text = input.value
  setTasksToLocalStorage()
  editList()
}

const onEditTaskModalConfirm = (taskElement) => {
  editTask(taskElement)
  if (taskElement.lastElementChild.className.includes('modal')) {
    taskElement.removeChild(taskElement.lastElementChild)
    setTasksToLocalStorage()
  }
}

const onEditTaskButtonClick = (taskElement) => {
  if (!taskElement.lastElementChild.className.includes('modal')) {
    editTaskModal = createModalElement()
    const confirmButton = editTaskModal.querySelector('.modal__confirm')
    confirmButton.addEventListener('click', () => onEditTaskModalConfirm(taskElement))
    taskElement.appendChild(editTaskModal)
    setTasksToLocalStorage()
  }
}

const completeTask = (id) => {
  const task = list.find((task) => task.id === id)
  task.completed = !task.completed
  setTasksToLocalStorage()
  editList()
}

const addEventListenersToTaskItem = (taskElement, task) => {
  const deleteButton = taskElement.querySelector('.task__button--delete')
  const editButton = taskElement.querySelector('.task__button--edit')
  const completeButton = taskElement.querySelector('.task__checkbox')
  // console.log(taskElement);

  deleteButton.addEventListener('click', () => deleteTask(task.id))
  editButton.addEventListener('click', () => onEditTaskButtonClick(taskElement, task.id))
  completeButton.addEventListener('click', () => completeTask(task.id))
}

const createTask = (task, index) => {
  const taskElement = createTaskElement(task, index)
  addEventListenersToTaskItem(taskElement, task)
  tasksWrapper.appendChild(taskElement)
}

const editList = () => {
  tasksWrapper.innerHTML = ''
  if (list.length > 0) {
    list.forEach((task, index) => {
      createTask(task, index)
    })
  }
}

editList()

addButton.addEventListener('click', addTaskToListAndLocalStorage)
