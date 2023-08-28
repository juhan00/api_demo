import {
  getCategoryListAPI,
  getBoardItemAPI,
  getImageFilesAPI,
  deleteTypeImageFilesAPI,
  updateBoardItemAPI,
  addImageFilesAPI,
  deleteBoardItemAPI,
  deleteAllImageFilesAPI,
} from "./common_api.js";
import { getParameterFromURL, getGroupByData } from "./common_utility.js";
import { FILE_USE_TYPE, PER_PAGE } from "./common_params.js";

//초기 셋팅
prepare();
let board_uuid = "";

async function prepare() {
  //게시물 id 가져오기
  const item_id = parseInt(getParameterFromURL("id"));

  //게시물 가져오기
  const board_item_data = await getBoardItemAPI(item_id);

  //uuid 저장하기
  board_uuid = board_item_data.uuid;

  //받아온 데이터 셋팅하기
  setBoardData(board_item_data);

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
  const image1_view = document.querySelector("#image1_view");
  const image2_view = document.querySelector("#image2_view");
  const multi_images_view = document.querySelector("#multi_images_view");
  const video_type = document.querySelector("#select_video_type");
  const video_link = document.querySelector("#input_video_link");
  const board_uuid = board_item_data.uuid;

  const delete_image1_check_box = document.querySelector(
    "#delete_image1_check_box"
  );
  const delete_image2_check_box = document.querySelector(
    "#delete_image2_check_box"
  );
  const delete_multi_image_check_box = document.querySelector(
    "#delete_multi_image_check_box"
  );
  const input_image1_box = document.querySelector("#input_image1_box");
  const input_image2_box = document.querySelector("#input_image2_box");
  const input_multi_images_box = document.querySelector(
    "#input_multi_images_box"
  );

  //타이틀 추가
  title.value = board_item_data.title;
  //내용 추가
  content.value = board_item_data.content;

  //이미지 데이터 가져오기
  const imageData = await getImageFilesAPI(board_uuid);
  //파일 유형으로 그룹핑
  const groupByData = getGroupByData(imageData, "file_use_type");

  const image_configs = [
    {
      dataKey: FILE_USE_TYPE.image1,
      deleteCheckbox: delete_image1_check_box,
      imageView: image1_view,
      inputBox: input_image1_box,
    },
    {
      dataKey: FILE_USE_TYPE.image2,
      deleteCheckbox: delete_image2_check_box,
      imageView: image2_view,
      inputBox: input_image2_box,
    },
    {
      dataKey: FILE_USE_TYPE.multi,
      deleteCheckbox: delete_multi_check_box,
      imageView: multi_images_view,
      inputBox: input_multi_images_box,
    },
  ];

  //이미지 추가 및 상태 변경
  image_configs.forEach((config) => {
    const imageData = groupByData[config.dataKey];

    if (imageData) {
      config.deleteCheckbox.style.display = "block";

      if (config.dataKey === "multi") {
        imageData.forEach(function (item, index) {
          const addImageView = `
            <img src="../../uploads/${item.file_name}" width="100px" />
          `;
          config.imageView.insertAdjacentHTML("beforeend", addImageView);
        });
      } else {
        const addImageView = `
          <img src="../../uploads/${imageData[0].file_name}" width="100px" />
        `;
        config.imageView.insertAdjacentHTML("beforeend", addImageView);
      }
    } else {
      config.imageView.style.height = "0px";
      config.deleteCheckbox.style.display = "none";
      config.inputBox.style.display = "block";
    }
  });
  //비디오 유형 추가
  const video_type_options = video_type.options;
  for (let i = 0; i < video_type_options.length; i++) {
    if (video_type_options[i].value === board_item_data.video_type) {
      video_type_options[i].selected = true;
      break;
    }
  }
  //비디오 링크 추가
  video_link.value = board_item_data.video_link;
}

async function updateBoardItem(board_uuid) {
  const category_uuid = document.querySelector("#select_category").value;
  const title = document.querySelector("#input_title").value;
  const content = document.querySelector("#textarea_content").value;
  const video_type = document.querySelector("#select_video_type").value;
  const video_link = document.querySelector("#input_video_link").value;
  const board_data = {
    category_uuid: category_uuid,
    title: title,
    content: content,
    uuid: board_uuid,
    video_type: video_type,
    video_link: video_link,
  };

  try {
    async function processImageType(board_uuid, input_element, file_use_type) {
      const delete_check = document.querySelector(
        `#delete_${file_use_type}_check`
      );
      // 이미지 삭제 체크 시
      if (delete_check.checked) {
        // 이미지 삭제
        await deleteTypeImageFilesAPI(board_uuid, file_use_type);
      }
      // 신규 이미지 추가
      if (input_element.files.length > 0) {
        await addImageFile(board_uuid, input_element, file_use_type);
      }
    }

    // 이미지 유형에 대한 배열
    const image_types = [
      { key: "image1", input_id: "input_image1" },
      { key: "image2", input_id: "input_image2" },
      { key: "multi", input_id: "input_multi_images" },
    ];

    // 각 이미지 유형 처리
    for (const type of image_types) {
      const input_element = document.getElementById(type.input_id);
      await processImageType(
        board_uuid,
        input_element,
        FILE_USE_TYPE[type.key]
      );
    }

    // 게시글 업데이트
    await updateBoardItemAPI(board_data);

    // 페이지 이동
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

//페이지 로드 후
document.addEventListener("DOMContentLoaded", function () {
  //image1 삭제 체크박스
  const delete_image1_check = document.querySelector("#delete_image1_check");
  const input_image1_box = document.querySelector("#input_image1_box");
  const input_image1 = document.querySelector("#input_image1");

  delete_image1_check.addEventListener("click", (event) => {
    if (delete_image1_check.checked) {
      input_image1_box.style.display = "block";
    } else {
      input_image1_box.style.display = "none";
      input_image1.value = "";
    }
  });

  //image2 삭제 체크박스
  const delete_image2_check = document.querySelector("#delete_image2_check");
  const input_image2_box = document.querySelector("#input_image2_box");
  const input_image2 = document.querySelector("#input_image2");
  delete_image2_check.addEventListener("click", (event) => {
    if (delete_image2_check.checked) {
      input_image2_box.style.display = "block";
    } else {
      input_image2_box.style.display = "none";
      input_image2.value = "";
    }
  });

  //multi image 삭제 체크박스
  const delete_multi_image_check = document.querySelector(
    "#delete_multi_check"
  );
  const input_multi_images_box = document.querySelector("#input_multi_box");
  const input_multi_image = document.querySelector("#input_multi_image");
  delete_multi_image_check.addEventListener("click", (event) => {
    if (delete_multi_image_check.checked) {
      input_multi_images_box.style.display = "block";
    } else {
      input_multi_images_box.style.display = "none";
      input_multi_image.value = "";
    }
  });

  //취소 버튼 클릭
  const btn_cancel = document.querySelector("#btn_cancel");
  btn_cancel.addEventListener("click", (event) => {
    window.location.href = "./index.html";
  });

  //저장 버튼 클릭
  const btn_update = document.querySelector("#btn_update");
  btn_update.addEventListener("click", (event) => {
    updateBoardItem(board_uuid);
  });

  //삭제 버튼 클릭
  const btn_delete = document.querySelector("#btn_delete");
  btn_delete.addEventListener("click", (event) => {
    if (confirm("삭제하시겠습니까?") === true) {
      deleteBoardItem(board_uuid);
    } else {
      return false;
    }
  });

  async function deleteBoardItem(board_uuid) {
    //게시판 글 삭제
    await deleteBoardItemAPI(board_uuid);
    await deleteAllImageFilesAPI(board_uuid);

    window.location.href = "./index.html";
  }
});
