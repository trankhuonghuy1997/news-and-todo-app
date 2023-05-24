"use strict";
// Khai báo các biến
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const todoContainer = $("#todo-container");
const inputTtask = $("#input-task");
const btnAdd = $("#btn-add");
const todoList = $("#todo-list");
let currentUser;

// Tạo class constructor taask
class Task {
  constructor(task, owner, isDone) {
    this.task = task;
    this.owner = owner;
    this.isDone = isDone;
  }
}

const KEY_TASK = "TASK_ARRAY";
let todoArr = JSON.parse(getFromStorage(KEY_TASK)) || [];

// Hàm render task ra màn hình
const renderTask = function (task, taskClass) {
  const html = `
    <li class = "${taskClass}">${task}<span class="close">×</span></li>
    `;
  todoList.insertAdjacentHTML("afterbegin", html);
};
// Kiểm ta tk đang login
const checkLogin = function () {
  for (const [key, value] of Object.entries(localStorage)) {
    if (key === "USER_LOGIN") {
      currentUser = JSON.parse(value);
      return currentUser;
    }
  }
};

// Hàm render các task đã có sẵn ra màn hình
const init = function () {
  checkLogin();
  todoArr.forEach((element) => {
    if (element.owner === currentUser.userName) {
      if (element.isDone) {
        renderTask(element.task, "checked");
      } else {
        renderTask(element.task);
      }
    }
  });
};
init();

// Lắng nghe sự kiện delegate vào element todolist
todoList.addEventListener("click", function (e) {
  //   console.log(e.target.);
  checkLogin();
  // Sự kiện xóa task
  if (e.target.classList.contains("close")) {
    if (confirm("Are you sure to delete this task")) {
      todoArr.forEach((element) => {
        if (
          element.task === e.target.closest("li").textContent.slice(0, -1) &&
          element.owner === currentUser.userName
        ) {
          todoArr = todoArr.filter((el) => el.task !== e.target.closest("li").textContent.slice(0, -1));
          saveToStorage(KEY_TASK, JSON.stringify(todoArr));
        }
        e.target.closest("li").remove();
      });
    }
  } else {
    // Kiểm tra sự kiện click vào các task và trả về isDone của task đó
    // Nếu isDone = false thì chuyển thành true và ngược lại
    // Sau đó cập nhật vào localstorage
    e.target.classList.toggle("checked");
    todoArr.forEach((element) => {
      if (
        e.target.classList.contains("checked") &&
        e.target.textContent.slice(0, -1) === element.task &&
        element.owner === currentUser.userName
      ) {
        element.isDone = true;
        saveToStorage(KEY_TASK, JSON.stringify(todoArr));
      } else if (
        !e.target.classList.contains("checked") &&
        e.target.textContent.slice(0, -1) === element.task &&
        element.owner === currentUser.userName
      ) {
        element.isDone = false;
        saveToStorage(KEY_TASK, JSON.stringify(todoArr));
      }
    });
  }
});

// Lắng ngeh sự kiện clich vào nút add
btnAdd.addEventListener("click", function () {
  if (inputTtask.value === "") {
    alert("Please input a Task!!");
    inputTtask.focus();
  } else {
    // Nếu nhập giá trị thì render ra màn hình sau đó lưu vào localstorage của username tương ứng
    renderTask(inputTtask.value);
    checkLogin();
    const owner = currentUser.userName;
    const newTask = new Task(inputTtask.value, owner, false);
    todoArr.push(newTask);
    inputTtask.value = "";
    saveToStorage(KEY_TASK, JSON.stringify(todoArr));
  }
});
