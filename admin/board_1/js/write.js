const board_name = "board_1";

//초기 셋팅
prepare();

async function prepare() {
  //카테고리 가져오기
  category_data = await getCategoryListAPI();
  renderCategorySelect(category_data);
}

//카테고리 탭 가져오기
async function getCategoryListAPI() {
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

//게시판 글 추가
async function addBoardItem() {
  const category = document.querySelector("#select_category").value;
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

  formData.append("category", category);
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

  try {
    const response = await fetch(`http://localhost/api_demo/api/board_1/`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      // const result = await response.text();
      // console.log(result);
      alert("저장되었습니다.");
      window.location.href = "./index.html";
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//UUID 생성
function generateUUID() {
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

  //취소 버튼 클릭
  const btn_save = document.querySelector("#btn_save");

  btn_save.addEventListener("click", (event) => {
    addBoardItem();
  });
});
