"use strict";
// hàm lưu dữ liệu vào local storage
function saveToStorage(key, value) {
  localStorage.setItem(key, value);
}

// hàm lấy dữ liệu vào local storage
function getFromStorage(key) {
  return localStorage.getItem(key);
}
