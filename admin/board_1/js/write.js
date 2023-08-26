import {
  getCategoryListAPI,
  addBoardItemAPI,
  addImageFilesAPI,
} from "./common_api.js";
import { generateUUID, generateCategoryID } from "./common_utility.js";
import { FILE_USE_TYPE, PER_PAGE } from "./common_params.js";

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
  const video_type = document.querySelector("#select_video_type").value;
  const video_link = document.querySelector("#input_video_link").value;
  const uuid = generateUUID();

  const board_data = {
    category_uuid: category_uuid,
    title: title,
    content: content,
    uuid: uuid,
    video_type: video_type,
    video_link: video_link,
  };

  try {
    //이미지 추가
    const input_image1 = document.getElementById("input_image1");
    const input_image2 = document.getElementById("input_image2");
    const input_multi_images = document.getElementById("input_multi_images");

    if (input_image1.files.length > 0) {
      await addImageFile(uuid, input_image1, FILE_USE_TYPE.image1);
    }

    if (input_image2.files.length > 0) {
      await addImageFile(uuid, input_image2, FILE_USE_TYPE.image2);
    }

    if (input_multi_images.files.length > 0) {
      await addImageFile(uuid, input_multi_images, FILE_USE_TYPE.multi);
    }

    //게시글 추가
    await addBoardItemAPI(board_data);

    alert("저장되었습니다.");
    window.location.href = "./index.html";
  } catch (error) {
    console.error("Error:", error);
  }
}

//이미지 파일 추가
async function addImageFile(board_uuid, file_input, file_use_type) {
  const files = file_input.files;

  if (files.length > 0) {
    const file_data = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = async function (e) {
        file_data.push({
          name: file.name,
          size: file.size,
          content: e.target.result.split(",")[1], // Base64 데이터
        });

        if (file_data.length === files.length) {
          //이미지 파일 추가 API
          await addImageFilesAPI(board_uuid, file_data, file_use_type);
        }
      };
      reader.readAsDataURL(file);
    }
  }
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

//페이지 로드 후
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
