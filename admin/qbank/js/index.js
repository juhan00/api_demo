import {
  getCategoryListAPI,
  getBoardListAPI,
  updateCategoryAPI,
  addCategoryAPI,
  deleteCategoryAPI,
} from "./common_api.js";
import { getDate, generateCategoryID } from "../../../utility/utility.js";
import { BOARD_NAME, PER_PAGE } from "./common_params.js";

//초기 셋팅
prepare();

async function prepare() {
  //카테고리 가져오기
  const category_data = await getCategoryListAPI();
  renderCategoryTab(category_data);
  renderCategoryList(category_data);

  setBoardCategoryList(1, PER_PAGE, "all");
}

async function setBoardCategoryList(page, per_page, category_uuid) {
  try {
    const board_list_data = await getBoardListAPI(
      page,
      per_page,
      category_uuid
    );
    renderBoardList(board_list_data);
  } catch (error) {
    console.error("Error:", error);
  }
}

//카테고리 업데이트
async function updateCategory(target) {
  const target_input = target.closest("tr").querySelector("input");
  const target_input_category_uuid = target_input.id;
  const target_input_value = target_input.value;

  await updateCategoryAPI(target_input_category_uuid, target_input_value);
  prepare();
}

//카테고리 추가
async function addCategory(target) {
  const target_input = target.closest("tr").querySelector("input");
  const category_uuid = generateCategoryID();
  const target_input_value = target_input.value;

  if (target_input_value === "") {
    alert("카테고리 이름을 입력해주세요.");
    return;
  }

  await addCategoryAPI(category_uuid, target_input_value);
  target_input.value = "";
  prepare();
}

//카테고리 삭제
async function deleteCategory(target) {
  const target_input = target.closest("tr").querySelector("input");
  const target_input_category_uuid = target_input.id;

  await deleteCategoryAPI(target_input_category_uuid);
  prepare();
}

//카테고리탭 렌더링
function renderCategoryTab(category_data) {
  const category_tab = document.querySelector("#category_tab");
  category_tab.innerHTML = "";

  const add_content_all = `
      <input
              type="radio"
              class="btn-check"
              name="btn_radio"
              id="all"
              autocomplete="off"
              checked
            />
            <label class="btn btn-outline-primary" for="all">전체</label>
      `;

  category_tab.insertAdjacentHTML("beforeend", add_content_all);

  category_data.forEach(function (item, index) {
    const add_content = `
      <input
              type="radio"
              class="btn-check"
              name="btn_radio"
              id="${item.category_uuid}"
              autocomplete="off"
            />
            <label class="btn btn-outline-primary" for="${item.category_uuid}">${item.name}</label>
      `;
    category_tab.insertAdjacentHTML("beforeend", add_content);
  });

  const add_content_not = `
      <input
              type="radio"
              class="btn-check"
              name="btn_radio"
              id="null"
              autocomplete="off"
            />
            <label class="btn btn-outline-primary" for="null">미등록</label>
      `;

  category_tab.insertAdjacentHTML("beforeend", add_content_not);
}

//카테고리 리스트 렌더링
function renderCategoryList(category_data) {
  const category_edit_list = document.querySelector(
    "#category_edit_list tbody"
  );
  category_edit_list.innerHTML = "";
  category_data.forEach(function (item) {
    const add_content = `
      <tr class="border border-top-0 text-center" style="height: 60px">
        <td class="col-auto text-start ps-4">
          <input
            type="text"
            class="form-control"
            size="7"
            id="${item.category_uuid}"
            value="${item.name}"
          />
        </td>
        <td class="col-auto">
          <div class="d-flex justify-content-end pe-3">
            <button type="button" id="btn_category_update" class="btn btn-outline-dark me-1">
              수정
            </button>
            <button type="button" id="btn_category_delete" class="btn btn-outline-dark">
              삭제
            </button>
          </div>
        </td>
      </tr>
    `;
    category_edit_list.insertAdjacentHTML("beforeend", add_content);
  });

  // 카테고리 수정 버튼
  const btn_category_update = document.querySelectorAll("#btn_category_update");
  btn_category_update.forEach((button) => {
    button.addEventListener("click", (event) => {
      updateCategory(event.target);
    });
  });

  // 카테고리 삭제 버튼
  const btn_category_delete = document.querySelectorAll("#btn_category_delete");
  btn_category_delete.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (confirm("삭제하시겠습니까?") === true) {
        deleteCategory(event.target);
      } else {
        return false;
      }
    });
  });
}

//게시판 리스트 렌더링
function renderBoardList(board_list_data) {
  const board_data = board_list_data.data;
  const page = board_list_data.page;
  const per_page = board_list_data.per_page;
  const total_count = board_list_data.total_count;

  const board_list = document.querySelector("#board_list tbody");
  board_list.innerHTML = "";
  if (board_data) {
    board_data.forEach(function (item, index) {
      const add_content = `
        <tr class="border border-top-0 text-center" style="height: 60px">
          <td class="col-1">${(page - 1) * per_page + (index + 1)}</td>
          <td class="col-9 text-start ps-4">
            <a href="./edit.html?id=${item.id}">${item.title}</a>
          </td>
          <td class="col-1">${getDate(item.datetime)}</td>
        </tr>
      `;
      board_list.insertAdjacentHTML("beforeend", add_content);
    });
  }
  renderPagingNumber(page, per_page, total_count);
}

function renderPagingNumber(page, per_page, total_count) {
  const paging_number = document.querySelector("#paging_number");
  const total_pages = Math.ceil(total_count / per_page);

  const pages_per_group = 5; // 한 그룹당 페이지 수
  const current_group = Math.ceil(page / pages_per_group); // 현재 페이지가 속한 그룹

  paging_number.innerHTML = "";

  const start_page = (current_group - 1) * pages_per_group + 1;
  const end_page = Math.min(current_group * pages_per_group, total_pages);

  // 이전 그룹 버튼 추가
  if (current_group > 1) {
    const prev_group_page = (current_group - 2) * pages_per_group + 1;
    const prev_group_button = `
      <button type="button" id="${prev_group_page}" class="btn btn-light">&lt;</button>
    `;
    paging_number.insertAdjacentHTML("beforeend", prev_group_button);
  }

  for (let i = start_page; i <= end_page; i++) {
    if (i === page) {
      const add_content = `
        <button type="button" id="${i}" class="btn btn-primary">${i}</button>
      `;
      paging_number.insertAdjacentHTML("beforeend", add_content);
    } else {
      const add_content = `
        <button type="button" id="${i}" class="btn btn-light">${i}</button>
      `;
      paging_number.insertAdjacentHTML("beforeend", add_content);
    }
  }

  // 다음 그룹 버튼 추가
  if (current_group * pages_per_group < total_pages) {
    const next_group_page = current_group * pages_per_group + 1;
    const next_group_button = `
      <button type="button" id="${next_group_page}" class="btn btn-light">&gt;</button>
    `;
    paging_number.insertAdjacentHTML("beforeend", next_group_button);
  }
}

//페이지 로드 후
document.addEventListener("DOMContentLoaded", function () {
  //카테고리 편집 버튼 클릭
  const btn_category_edit = document.querySelector("#btn_category_edit");
  const category_edit_list = document.querySelector("#category_edit_list");

  btn_category_edit.addEventListener("click", (event) => {
    if (category_edit_list.style.display === "none") {
      category_edit_list.style.display = "block";
      btn_category_edit.innerHTML = "카테고리 편집 닫기";
    } else {
      category_edit_list.style.display = "none";
      btn_category_edit.innerHTML = "카테고리 편집";
    }
  });

  const btn_category_add = document.querySelector("#btn_category_add");
  btn_category_add.addEventListener("click", (event) => {
    addCategory(event.target);
  });

  //글쓰기 버튼 클릭
  const btn_board_write = document.querySelector("#btn_board_write");

  btn_board_write.addEventListener("click", (event) => {
    window.location.href = "./write.html";
  });

  //카테고리 탭 클릭
  const category_tab = document.querySelector("#category_tab");

  category_tab.addEventListener("click", (event) => {
    if (event.target.tagName === "INPUT") {
      const category_uuid = event.target.getAttribute("id");

      if (category_uuid === "all") {
        //전체 클릭 시
        setBoardCategoryList(1, PER_PAGE, "all");
      } else if (category_uuid === "null") {
        //미등록 클릭 시
        setBoardCategoryList(1, PER_PAGE, null);
      } else {
        //카테고리 클릭 시
        setBoardCategoryList(1, PER_PAGE, category_uuid);
      }
      // console.log(event.target.getAttribute("id"));
    }
  });

  //페이징 버튼 클릭
  const btn_paging_number = document.querySelector("#paging_number");

  btn_paging_number.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const clicked_page = event.target.getAttribute("id");
      const category_tab = document.querySelector(
        "#category_tab > input:checked"
      );
      const category_uuid = category_tab.getAttribute("id");
      setBoardCategoryList(clicked_page, PER_PAGE, category_uuid);
    }
  });
});
