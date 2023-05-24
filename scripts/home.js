"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const loginModal = $("#login-modal");
const mainContent = $("#main-content");
const wcMessage = $("#welcome-message");
const btnLogout = $("#btn-logout");
let user;

// Hàm kiểm tra và trả về tài khoan đang login
const checkLogin = function () {
  for (const [key, value] of Object.entries(localStorage)) {
    // Lặp các dữ liệu trong localstorage
    if (key === "USER_LOGIN") {
      user = JSON.parse(value);
      return user;
    }
  }
};

// Nếu có tài khoan đang login thì hiển thị Welcom + name nếu không thì hiển thị màn hình gốc
if (checkLogin()) {
  loginModal.classList.add("hidden");
  wcMessage.textContent = `Welcome ${user.firstName} ${user.lastName} `;
  btnLogout.classList.remove("hidden");
}

//  lắng nghe sự kiện logout và xóa user đang login ra khỏi local storage
btnLogout.addEventListener("click", function () {
  localStorage.removeItem("USER_LOGIN");
  window.location.href = "../pages/login.html";
});
