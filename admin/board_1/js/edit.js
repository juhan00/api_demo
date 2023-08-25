import {
  getCategoryListAPI,
  getBoardItemAPI,
  getImageItemsAPI,
} from "./common_api.js";
import { getParameterFromURL } from "./common_utility.js";
import { BOARD_NAME, PER_PAGE } from "./common_params.js";

//초기 셋팅
prepare();

async function prepare() {
  //게시물 id 가져오기
  const item_id = parseInt(getParameterFromURL("id"));

  //게시물 가져오기
  const board_item_data = await getBoardItemAPI(item_id);

  //받아온 데이터 셋팅하기
  setBoardData(board_item_data);
  console.log(board_item_data);

  //카테고리 가져오기
  const category_data = await getCategoryListAPI();
  const category_uuid = board_item_data.category_uuid;
  renderCategorySelect(category_data, category_uuid);
}

//카테고리 드롭박스 렌더링
function renderCategorySelect(category_data, category_uuid) {
  const select_category = document.querySelector("#select_category");
  select_category.innerHTML = "";

  let hasMatch = false;
  category_data.forEach(function (item, index) {
    const add_content = `
      <option value="${item.category_uuid}" ${
      category_uuid === item.category_uuid ? "selected" : ""
    }>${item.name}</option>
      `;
    select_category.insertAdjacentHTML("beforeend", add_content);

    if (category_uuid === item.category_uuid) {
      hasMatch = true;
    }
  });
  //미등록일때
  if (!hasMatch) {
    const add_unregistered_option = `
      <option value="" selected>미등록</option>
    `;
    select_category.insertAdjacentHTML("beforeend", add_unregistered_option);
  }
}

//데이터 셋팅
async function setBoardData(board_item_data) {
  const title = document.querySelector("#input_title");
  const content = document.querySelector("#textarea_content");
  const image1 = document.querySelector("#input_image1");
  const image2 = document.querySelector("#input_image2");
  const multi_images = document.querySelector("#input_multi_images");
  const video_type = document.querySelector("#select_video_type");
  const video_link = document.querySelector("#input_video_link");
  const board_uuid = board_item_data.uuid;
  title.value = board_item_data.title;
  content.value = board_item_data.content;

  console.log("board_uuid:", board_uuid);
  const imageData = await getImageItemsAPI(board_uuid);

  console.log(imageData);
  // imageData.forEach(function (item, index) {
  //   console.log(item.id);
  // });
  // image1.value = board_item_data.image1;
}

document.addEventListener("DOMContentLoaded", function () {});
