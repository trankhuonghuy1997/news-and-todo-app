"use strict";

// variable declaration
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const inputFirstName = $("#input-firstname");
const inputLastName = $("#input-lastname");
const inputUserName = $("#input-username");
const inputPassword = $("#input-password");
const inputPasswordConfirm = $("#input-password-confirm");
const btnRegister = $("#btn-submit");
// console.log(btnRegister);
// console.log(inputFirstName);

let firstName, lastName, userName, password, passwordConfirm;
let isValidate;
const KEY = "USER_ARRAY";
const userArr = JSON.parse(getFromStorage(KEY)) || [];

// Validation function: kiểm tra và validate các giá trị nhập vào
const validate = function () {
  isValidate = true;
  if ((isValidate = true && inputFirstName.value === "")) {
    alert("Please input First Name");
    inputFirstName.focus();
    return (isValidate = false);
  }

  if ((isValidate = true && inputLastName.value === "")) {
    alert("Please input Last Name");
    inputLastName.focus();
    return (isValidate = false);
  }

  if ((isValidate = true && inputUserName.value === "")) {
    alert("Please input User Name");
    inputUserName.focus();
    return (isValidate = false);
  } else {
    for (const [key, value] of Object.entries(localStorage)) {
      if (JSON.parse(value).userName === inputUserName.value) {
        alert("User Name is already exist. Please you other one!!!");
        inputUserName.focus();
        return (isValidate = false);
      }
    }
  }

  if ((isValidate = true && inputPassword.value === "")) {
    alert("Please input Password");
    inputPassword.focus();
    return (isValidate = false);
  } else if (inputPassword.value.length < 8) {
    alert("Password must have more than 8 character!!");
    inputPassword.focus();
    return (isValidate = false);
  }

  if ((isValidate = true && inputPasswordConfirm.value === "")) {
    alert("Please Confirm Password");
    inputPasswordConfirm.focus();
    return (isValidate = false);
  } else if (inputPasswordConfirm.value !== inputPassword.value) {
    alert("Passwords did not match");
    inputPasswordConfirm.focus();
    return (isValidate = false);
  }
  return (isValidate = true);
};

// get data input
function getdata() {
  if (isValidate) {
    firstName = inputFirstName.value;
    lastName = inputLastName.value;
    userName = inputUserName.value;
    password = inputPassword.value;
    const newUser = new User(firstName, lastName, userName, password);

    inputFirstName.value = "";
    inputLastName.value = "";
    inputUserName.value = "";
    inputPassword.value = "";
    inputPasswordConfirm.value = "";
    // Thêm data register vào localstorage
    userArr.push(newUser);
    saveToStorage(KEY, JSON.stringify(userArr));
  }
}

// Lắng nghe sự kiện nút register hiển thị thông báo nếu thành công và chuyển sang trang login
btnRegister.addEventListener("click", function () {
  validate();
  if (isValidate) {
    getdata();

    alert("Đăng ký thành công!!!");
    window.location.href = "../pages/login.html";
  }
});
