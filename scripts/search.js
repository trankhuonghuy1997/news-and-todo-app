"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const btnSubmit = $("#btn-submit");
const inputQuery = $("#input-query");
const pageNavigation = $(".page_navigation");
let pagePagination;
const newsContainer = $("#news-container");
let btnPrev;
let btnnext;
let pageNum;
let currentPage = 1;
let pageNow;
let page_count;
let page_items;
let settingData;
let currentUser;

// --------------------------------

// Các hàm sử lý tương tự như trang news chỉ khác ở chổ truyển keywork vào tìm kiếm

// --------------------------------
const checkLogin = function () {
  for (const [key, value] of Object.entries(localStorage)) {
    if (key === "USER_LOGIN") {
      currentUser = JSON.parse(value);
      return currentUser;
    }
  }
};

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

function paginationButton(list, pageSize) {
  pageNavigation.innerHTML = "";
  //list, page per page, currpage, container
  page_count = Math.ceil(list.length / pageSize);

  let label = document.createElement("ul");
  label.classList.add("pagination", "justify-content-center");
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
  pageItem.insertAdjacentHTML("beforebegin", htmlprev);
  pagePagination.insertAdjacentHTML("beforeend", htmlNext);
  return page_count;
}

const displayPostInPage = function (list, wrapper, pageSize, currentPage) {
  wrapper.innerHTML = "";
  currentPage--;

  let start = pageSize * currentPage;
  let end = start + pageSize;
  let paginatedItems = list.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    renderPost(paginatedItems[i]);
  }
};

const nextPage = function () {
  if (currentPage === page_count) {
    currentPage = page_count;
  } else {
    currentPage++;
  }
  return currentPage;
};

const prevPage = function () {
  if (currentPage === 1) {
    currentPage = 1;
  } else {
    currentPage--;
  }
  return currentPage;
};

const activeClassHandel = function (currentPage) {
  btnPrev = $("#btn-prev");
  btnnext = $("#btn-next");
  pageNum = $$("#page-num");
  page_items = $$(".page-item");

  pageNum.forEach((element) => {
    element.closest("li").classList.remove("active");
    if (Number(element.closest("li").dataset.index) === currentPage) {
      element.closest("li").classList.add("active");
    }
  });
  if (currentPage === 1) {
    btnPrev.closest("li").classList.add("disabled");
    btnnext.closest("li").classList.remove("disabled");
  } else if (currentPage === page_count) {
    btnPrev.closest("li").classList.remove("disabled");
    btnnext.closest("li").classList.add("disabled");
  } else {
    btnPrev.closest("li").classList.remove("disabled");
    btnnext.closest("li").classList.remove("disabled");
  }
};

const postData = function (keyWord, api) {
  return fetch(`https://newsapi.org/v2/top-headlines?q=${keyWord}&apiKey=${api}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (!data.totalResults) throw new Error(error.status);
      const article = data.articles;

      paginationButton(article, 5, 1, newsContainer);
      displayPostInPage(article, newsContainer, 5, 1);
      activeClassHandel(currentPage);
      pageNavigation.addEventListener("click", function (e) {
        if (e.target.classList.contains("page-num")) {
          currentPage = Number(e.target.closest("li").dataset.index);
          displayPostInPage(article, newsContainer, 5, currentPage);
          activeClassHandel(currentPage);
          return currentPage;
        }
      });
      btnnext = $("#btn-next");
      btnPrev = $("#btn-prev");
      btnnext.addEventListener("click", function () {
        nextPage();
        displayPostInPage(article, newsContainer, 5, currentPage);
        activeClassHandel(currentPage);
      });

      btnPrev.addEventListener("click", function () {
        prevPage();
        displayPostInPage(article, newsContainer, 5, currentPage);
        activeClassHandel(currentPage);
      });
    })
    .catch((err) => {
      newsContainer.innerHTML = "";
      const html = `
            <h1 style = "font-size: 20px; text-align: center">Something went wrong ${err}</h1>
        `;
      newsContainer.insertAdjacentHTML("beforeend", html);
    });
};

btnSubmit.addEventListener("click", function () {
  if (inputQuery.value === "") {
    alert("Tell me what do you want to search");
    inputQuery.focus();
  } else {
    postData(inputQuery.value, "fcb68b1410f24e608a015207a63fc487");
  }
});
