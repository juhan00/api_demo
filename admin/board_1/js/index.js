let category_data = []; // 전역 변수로 데이터 저장
const board_name = "board_1";

//초기 셋팅
prepare();

async function prepare() {
  //게시판이름

  category_data = await getCategoryListAPI(board_name);
  renderCategoryTab(category_data);
  renderCategoryList(category_data);
}

//카테고리 탭 가져오기
async function getCategoryListAPI(board_name) {
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/category/?board_name=${board_name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      // console.log(result);
      return result;
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//카테고리 업데이트
async function updateCategory(target) {
  const target_input = target.closest("tr").querySelector("input");
  const target_input_category_id = target_input.id;
  const target_input_value = target_input.value;

  console.log(target_input_category_id);

  try {
    const response = await fetch(
      `http://localhost/api_demo/api/category/?category_id=${target_input_category_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: target_input_value,
        }),
      }
    );
    if (response.ok) {
      prepare();
      // const updated_category_data = await getCategoryListAPI(board_name);
      // renderCategoryTab(updated_category_data);
      // const result = await response.json();
      // return result;
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//카테고리 추가
async function addCategory(target) {
  const target_input = target.closest("tr").querySelector("input");
  const category_id = generateCategoryID();
  const target_input_value = target_input.value;

  if (target_input_value === "") {
    alert("카테고리 이름을 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(`http://localhost/api_demo/api/category/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: target_input_value,
        board_name: board_name,
        category_id: category_id,
      }),
    });
    if (response.ok) {
      target_input.value = "";
      prepare();
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//카테고리 삭제
async function deleteCategory(target) {
  const target_input = target.closest("tr").querySelector("input");
  const target_input_category_id = target_input.id;

  try {
    const response = await fetch(
      `http://localhost/api_demo/api/category/?category_id=${target_input_category_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      prepare();
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
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
              id="category_tab_all"
              autocomplete="off"
              checked
            />
            <label class="btn btn-outline-primary" for="category_tab_all">전체</label>
      `;

  category_tab.insertAdjacentHTML("beforeend", add_content_all);

  category_data.forEach(function (item, index) {
    const add_content = `
      <input
              type="radio"
              class="btn-check"
              name="btn_radio"
              id="${item.category_id}"
              autocomplete="off"
            />
            <label class="btn btn-outline-primary" for="${item.category_id}">${item.name}</label>
      `;
    category_tab.insertAdjacentHTML("beforeend", add_content);
  });

  const add_content_not = `
      <input
              type="radio"
              class="btn-check"
              name="btn_radio"
              id="category_tab_not"
              autocomplete="off"
            />
            <label class="btn btn-outline-primary" for="category_tab_not">미등록</label>
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
                id="${item.category_id}"
                value="${item.name}"
              />
            </td>
            <td class="col-auto">
              <div class="d-flex justify-content-end pe-3">
                <button type="button" onclick="updateCategory(this);" class="btn btn-outline-dark me-1">
                  수정
                </button>
                <button type="button" onclick="deleteCategory(this);" class="btn btn-outline-dark">
                  삭제
                </button>
              </div>
            </td>
          </tr>
    `;
    category_edit_list.insertAdjacentHTML("beforeend", add_content);
  });
}

//category id 생성
function generateCategoryID() {
  let d = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); // 추가적인 고정값을 현재 시간에 더해 더 높은 고유성을 확보합니다.
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

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

  //글쓰기 버튼 클릭
  const btn_board_write = document.querySelector("#btn_board_write");

  btn_board_write.addEventListener("click", (event) => {
    window.location.href = "./write.html";
  });
});
