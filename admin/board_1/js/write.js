import { getCategoryListAPI, addBoardItemAPI } from "./common_api.js";
import { generateUUID, generateCategoryID } from "./common_utility.js";
import { BOARD_NAME, PER_PAGE } from "./common_params.js";

//초기 셋팅
prepare();

async function prepare() {
  //카테고리 가져오기
  const category_data = await getCategoryListAPI();
  renderCategorySelect(category_data);
}

//게시판 글 추가
async function addBoardItem() {
  const category_uuid = document.querySelector("#select_category").value;
  const title = document.querySelector("#input_title").value;
  const content = document.querySelector("#textarea_content").value;
  const image1 = document.querySelector("#input_image1").files[0];
  const image2 = document.querySelector("#input_image2").files[0];
  const multi_images = document.querySelector("#input_multi_images").files;
  const video_type = document.querySelector("#select_video_type").value;
  const video_link = document.querySelector("#input_video_link").value;

  if (input_title.value === "") {
    alert("제목을 입력해주세요.");
    return;
  }

  const formData = new FormData();

  formData.append("category_uuid", category_uuid);
  formData.append("title", title);
  formData.append("content", content);
  formData.append("uuid", generateUUID());
  formData.append("video_type", video_type);
  formData.append("video_link", video_link);

  if (image1) {
    formData.append("image1", image1);
  }

  if (image2) {
    formData.append("image2", image2);
  }

  if (multi_images) {
    for (let i = 0; i < multi_images.length; i++) {
      formData.append("multi_images[]", multi_images[i]);
    }
  }

  //게시글 추가
  await addBoardItemAPI(formData);

  alert("저장되었습니다.");
  window.location.href = "./index.html";
}

//카테고리 드롭박스 렌더링
function renderCategorySelect(category_data) {
  const select_category = document.querySelector("#select_category");
  select_category.innerHTML = "";

  category_data.forEach(function (item, index) {
    const add_content = `
      <option value="${item.category_uuid}">${item.name}</option>
      `;
    select_category.insertAdjacentHTML("beforeend", add_content);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  //취소 버튼 클릭
  const btn_cancel = document.querySelector("#btn_cancel");
  btn_cancel.addEventListener("click", (event) => {
    window.location.href = "./index.html";
  });

  //저장 버튼 클릭
  const btn_save = document.querySelector("#btn_save");
  btn_save.addEventListener("click", (event) => {
    addBoardItem();
  });
});
