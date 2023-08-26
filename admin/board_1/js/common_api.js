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
async function addBoardItemAPI(board_data) {
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/${BOARD_NAME}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_uuid: board_data.category_uuid,
          title: board_data.title,
          content: board_data.content,
          uuid: board_data.uuid,
          video_type: board_data.video_type,
          video_link: board_data.video_link,
        }),
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

//게시판 글 업데이트
async function updateBoardItemAPI(board_data) {
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/${BOARD_NAME}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_uuid: board_data.category_uuid,
          title: board_data.title,
          content: board_data.content,
          uuid: board_data.uuid,
          video_type: board_data.video_type,
          video_link: board_data.video_link,
        }),
      }
    );
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

//이미지파일 추가
async function addImageFilesAPI(board_uuid, file_data, file_use_type) {
  console.log(board_uuid, file_data, file_use_type);
  try {
    const response = await fetch("http://localhost/api_demo/api/image/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_uuid: board_uuid,
        file_data: file_data,
        file_use_type: file_use_type,
      }),
    });

    if (response.ok) {
      // const result = await response.text();
      // console.log(result);
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//유형별 이미지파일 삭제
async function deleteTypeImageFilesAPI(board_uuid, file_use_type) {
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/image/?board_uuid=${board_uuid}&file_use_type=${file_use_type}`,
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

//이미지파일 가져오기
async function getImageFilesAPI(board_uuid) {
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
  updateBoardItemAPI,
  getBoardItemAPI,
  getImageFilesAPI,
  deleteTypeImageFilesAPI,
  addImageFilesAPI,
};
