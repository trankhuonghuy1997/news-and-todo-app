"use strict";
// variable declaration
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const inputUserName = $("#input-username");
const inputPassword = $("#input-password");

const btnLogin = $("#btn-submit");
let user;
let currentAccount, isValidate;
const KEYLOGIN = "USER_LOGIN";

// Hàm trả về tất cả user đã login
function userLogin() {
  for (const [key, value] of Object.entries(localStorage)) {
    if (key === "USER_ARRAY") {
      user = JSON.parse(value);
      return user;
    }
  }
}

// Validat login
const validateLogin = function () {
  isValidate = true;
  // Hiển thị thông báo về input của user name login
  if (isValidate === true && inputUserName.value === "") {
    alert("Please input User Name");
    inputUserName.focus();
    return (isValidate = false);
  } else {
    // Kiểm tra tài khoản login có đung hay không
    userLogin();
    currentAccount = user.find((acc) => acc.userName === inputUserName.value);
    if (!currentAccount) {
      alert("Account does not exist!!!");
      inputUserName.focus();
      return (isValidate = false);
    } else if ((isValidate = true && inputPassword.value === "")) {
      // Nếu username đúng thì kiểm tra pasword và đưa ra thông báo
      alert("Please Input Password!!!");
      inputPassword.focus();
      return (isValidate = false);
    } else {
      isValidate = true;
      return currentAccount;
      // Trả về tài khoản đang login thành công
    }
  }
};

// Lắng nghe sự kiện click vào nút login
btnLogin.addEventListener("click", function () {
  validateLogin(); // Validate các trường nhập dữ liệu
  if (isValidate) {
    // Nếu passeord ko đúng thì hiển thị thông báo
    if (currentAccount.password !== inputPassword.value) {
      alert("Wrong Password!!!");
      inputPassword.focus();
    } else {
      // Nếu pasword đúng thì lưu tt đăng nhập và chuyển sang thẻ home
      saveToStorage(KEYLOGIN, JSON.stringify(currentAccount));
      window.location.href = "../index.html";
    }
  }
});
