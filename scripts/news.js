"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const newsContainer = $("#news-container");
const pageItem = $(".page-item");
const pageNavigation = $(".page_navigation");
let btnPrev;
let btnnext;
let pageNum;
let currentPage = 1;
let pageNow;
let page_count;
let page_items;
let settingData;
let currentUser;
// Hàm kiểm tra và trả về tk đang login
const checkLogin = function () {
  for (const [key, value] of Object.entries(localStorage)) {
    if (key === "USER_LOGIN") {
      currentUser = JSON.parse(value);
      return currentUser;
    }
  }
};

// Hàm render port ra news container
const renderPost = function (postData) {
  const html = `
            <div class="card flex-row flex-wrap">
                <div class="card mb-3" style="">
                    <div class="row no-gutters">
                        <div class="col-md-4">
                        <img
                            src="${postData.urlToImage}"
                            class="card-img"
                            alt="${postData.title}"
                        />
                        </div>
                        <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">
                            ${postData.title}
                            </h5>
                            <p class="card-text">
                            ${postData.description}
                            </p>
                            <a href=${postData.url} class="btn btn-primary" target="_blank"
                            >View</a
                            >
                        </div>
                    </div>
                </div>
            </div>
            `;
  newsContainer.insertAdjacentHTML("beforeend", html);
};

// Hàm Hiển thị số lượng trang trong page navigation
function paginationButton(list, pageSize) {
  // Tính số lượng page_count từ tổng số kết quả fetch trả về(list) chia cho số page trong 1 trang
  page_count = Math.ceil(list.length / pageSize);

  // Tạo label el và pagination element
  let label = document.createElement("ul");
  label.classList.add("pagination", "justify-content-center");

  // Thêm số lượng trang vào pagination từ page_count
  for (let i = 1; i <= page_count; i++) {
    label.innerHTML += `          
      <li class="page-item" data-index = ${i}>
        <a class="page-link  page-num" id="page-num">${i}</a>
      </li>
            
    `;
  }
  pageNavigation.appendChild(label);
  const pagePagination = $(".pagination");
  const pageItem = $(".page-item");

  const htmlprev = `
      <li class="page-item">
          <button class="page-link" href="#" id="btn-prev">Previous</button>
      </li>
  `;

  const htmlNext = `
      <li class="page-item">
          <button class="page-link" id="btn-next">Next</button>
     </li>
  `;
  // Thêm nút prev vào trước pagination đầu tiên
  pageItem.insertAdjacentHTML("beforebegin", htmlprev);

  // Thêm nút next  vào sau pagination cuối cùng
  pagePagination.insertAdjacentHTML("beforeend", htmlNext);
  return page_count;
}

// Hàm hiển thị bài báo ra news container
const displayPostInPage = function (list, wrapper, pageSize, currentPage) {
  // Xóa hết innerHTML của phần tử chứa
  wrapper.innerHTML = "";
  currentPage--;

  // Start là index của bài đầu tiên cần render
  // ?end là index của bài cuối cần render
  let start = pageSize * currentPage;
  let end = start + pageSize;
  // Slice các bài báo từ start đến end trong list mà fetch trả về
  let paginatedItems = list.slice(start, end);

  // Duyệt qua các bài báo từ start đến end và render ra news container
  for (let i = 0; i < paginatedItems.length; i++) {
    renderPost(paginatedItems[i]);
  }
};

// hàm chuyển sang next page
const nextPage = function () {
  // Nếu currpage ở số lớn nhất thì gán cho current page ở đó
  if (currentPage === page_count) {
    currentPage = page_count;
  } else {
    // Nếu ko thì tăng currentpage lên 1 đơn vị
    currentPage++;
  }
  return currentPage;
};

// hàm chuyển sang bài trước
const prevPage = function () {
  // Nếu bài hiện tại là 1 thì gán là 1
  if (currentPage === 1) {
    currentPage = 1;
  } else {
    // Nếu ko thì giảm 1 đơn vị
    currentPage--;
  }
  return currentPage;
};

// Hàm để điều khiển các class active trong pageNavigation
const activeClassHandel = function (currentPage) {
  // Khai báo biến
  btnPrev = $("#btn-prev");
  btnnext = $("#btn-next");
  pageNum = $$("#page-num");
  page_items = $$(".page-item");

  // Duyệt qua các phần tử là trang của bài báo, remove class active sau đó kiểm tả nếu current page
  // bằnng với phần tử nào có dât-index tường ứng thì active
  pageNum.forEach((element) => {
    element.closest("li").classList.remove("active");
    if (Number(element.closest("li").dataset.index) === currentPage) {
      element.closest("li").classList.add("active");
    }
  });
  // Nếu current là 1 thì disabled nút prev và active nút next
  if (currentPage === 1) {
    btnPrev.closest("li").classList.add("disabled");
    btnnext.closest("li").classList.remove("disabled");
    // Nếu là page cuối thì disabled nút next và active nút prev
  } else if (currentPage === page_count) {
    btnPrev.closest("li").classList.remove("disabled");
    btnnext.closest("li").classList.add("disabled");
    // Cac trường hợp khác thì active cả 2
  } else {
    btnPrev.closest("li").classList.remove("disabled");
    btnnext.closest("li").classList.remove("disabled");
  }
};

const getSettingData = function () {
  checkLogin();
  // Lấy dữ liệu setting
  for (const [key, value] of Object.entries(localStorage)) {
    // Nếu có thì lấy setting data
    if (key === "SETTING") {
      settingData = JSON.parse(value);
      if (settingData.owner === currentUser.userName) {
        return settingData;
      }
    }
  }
};

// Hàm lấy các bài báo bằng api
const postData = function (country, category, pageSize, apiKey, page) {
  // Sử dụng fetch để lấy dữ liệu
  fetch(
    `https://newsapi.org/v2/top-headlines?country=${(country = country)}&category=${(category =
      category)}&pageSize=${pageSize}&apiKey=${apiKey}`
  )
    // Sử lý dử liệu trả về
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const article = data.articles;
      console.log(article);
      // Tạo các nút pagination
      paginationButton(article, page);
      // Khởi tạo trang đầu tiên khi mới vào app
      displayPostInPage(article, newsContainer, page, currentPage);
      // Gọi hàm để điều khiển các class active
      activeClassHandel(currentPage);
      // lắng nghe sự kiện delegate ở pageNavigation
      pageNavigation.addEventListener("click", function (e) {
        // Nếu click vào el có class page-num thì render các bài báo ở trang tương ứng
        if (e.target.classList.contains("page-num")) {
          currentPage = Number(e.target.closest("li").dataset.index);
          displayPostInPage(article, newsContainer, page, currentPage);
          activeClassHandel(currentPage);
          return currentPage;
        }
      });
      btnnext = $("#btn-next");
      btnPrev = $("#btn-prev");
      // Lắng nghe sự kiện ở nút next
      btnnext.addEventListener("click", function () {
        nextPage();
        displayPostInPage(article, newsContainer, page, currentPage);
        activeClassHandel(currentPage);
      });

      // lắng nghe sự kiện ở nút prev
      btnPrev.addEventListener("click", function () {
        prevPage();
        displayPostInPage(article, newsContainer, page, currentPage);
        activeClassHandel(currentPage);
      });
    })
    // Bắt lỗi nếu có
    .catch((err) => console.log(err));
};
// Gọi hàm để thực hiện
function newsApp() {
  getSettingData();
  if (settingData && settingData.owner === currentUser.userName) {
    postData("us", settingData.category, 22, "fcb68b1410f24e608a015207a63fc487", Number(settingData.newsPerPage));
  } else {
    postData("us", "sport", 22, "fcb68b1410f24e608a015207a63fc487", 5);
  }
}
newsApp();
