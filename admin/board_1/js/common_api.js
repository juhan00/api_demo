import { BOARD_NAME, PER_PAGE } from "./common_params.js";

//카테고리 탭 가져오기
async function getCategoryListAPI() {
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/category/?board_name=${BOARD_NAME}`,
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
async function updateCategoryAPI(category_uuid, name) {
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/category/?category_uuid=${category_uuid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
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
async function addCategoryAPI(category_uuid, name) {
  try {
    const response = await fetch(`http://localhost/api_demo/api/category/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        board_name: BOARD_NAME,
        category_uuid: category_uuid,
      }),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

//카테고리 삭제
async function deleteCategoryAPI(category_uuid) {
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/category/?category_uuid=${category_uuid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//게시판 리스트 가져오기
async function getBoardListAPI(page, per_page, category_uuid) {
  let fetch_url = "";

  if (category_uuid || category_uuid === null) {
    fetch_url = `http://localhost/api_demo/api/${BOARD_NAME}/?page=${page}&per_page=${per_page}&category_uuid=${category_uuid}`;
  } else {
    fetch_url = `http://localhost/api_demo/api/${BOARD_NAME}/?page=${page}&per_page=${per_page}`;
  }

  try {
    const response = await fetch(fetch_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
async function addBoardItemAPI(formData) {
  console.log(formData.get("image1"));
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/${BOARD_NAME}/`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const result = await response.text();
      return result;
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//게시판 글 가져오기
async function getBoardItemAPI(id) {
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/${BOARD_NAME}/?id=${id}`,
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

//이미지 가져오기
async function getImageItemsAPI(board_uuid) {
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/image/?board_uuid=${board_uuid}`,
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

export {
  getCategoryListAPI,
  updateCategoryAPI,
  addCategoryAPI,
  deleteCategoryAPI,
  getBoardListAPI,
  addBoardItemAPI,
  getBoardItemAPI,
  getImageItemsAPI,
};
