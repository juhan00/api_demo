import {
  QBANK_GROUP_NAME,
  QBANK_QUESTION_NAME,
  QBANK_ITEM_NAME,
} from "./common_params.js";

//그룹 가져오기
async function getGroupAPI(group_uuid) {
  const fetch_url = `../../api/${QBANK_GROUP_NAME}/?group_uuid=${group_uuid}`;

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

//그룹 리스트 가져오기
async function getGroupListAPI(page, per_page) {
  const fetch_url = `../../api/${QBANK_GROUP_NAME}/?page=${page}&per_page=${per_page}`;

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

//그룹 추가
async function addGroupAPI(board_data) {
  try {
    const response = await fetch(`../../api/${QBANK_GROUP_NAME}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_uuid: board_data.group_uuid,
        group_title: board_data.group_title,
        questions_count: board_data.questions_count,
      }),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

//질문 추가
async function addQuestionDataAPI(question_data) {
  console.log(question_data);
  try {
    const response = await fetch(`../../api/${QBANK_QUESTION_NAME}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_uuid: question_data.group_uuid,
        question_uuid: question_data.question_uuid,
        question_title: question_data.question_title,
        items_count: question_data.items_count,
        multiple_selection: question_data.multiple_selection,
        subjective: question_data.subjective,
      }),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

//질문 업데이트
async function updateQuestionDataAPI(question_data) {
  try {
    const response = await fetch(`../../api/${QBANK_QUESTION_NAME}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: question_data.id,
        question_title: question_data.question_title,
        items_count: question_data.items_count,
        multiple_selection: question_data.multiple_selection,
        subjective: question_data.subjective,
      }),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

//질문 데이터 가져오기
async function getQuestionDataAPI(group_uuid) {
  const fetch_url = `../../api/${QBANK_QUESTION_NAME}/?group_uuid=${group_uuid}`;

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

//답변 추가
async function addItemDataAPI(item) {
  try {
    const response = await fetch(`../../api/${QBANK_ITEM_NAME}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_uuid: item.group_uuid,
        question_uuid: item.question_uuid,
        item_title: item.item_title,
        item_key: item.item_key,
      }),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

//답변 업데이트
async function updateItemDataAPI(item) {
  try {
    const response = await fetch(`../../api/${QBANK_ITEM_NAME}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.id,
        item_title: item.item_title,
        item_key: item.item_key,
      }),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

//답변 데이터 가져오기
async function getItemDataAPI(question_uuid) {
  const fetch_url = `../../api/${QBANK_ITEM_NAME}/?question_uuid=${question_uuid}`;

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

//답변 데이터 삭제
async function deleteItemDataAPI(question_uuid) {
  try {
    const response = await fetch(
      `../../api/${QBANK_ITEM_NAME}/?question_uuid=${question_uuid}`,
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

export {
  getGroupAPI,
  getGroupListAPI,
  addGroupAPI,
  addQuestionDataAPI,
  updateQuestionDataAPI,
  getQuestionDataAPI,
  addItemDataAPI,
  deleteItemDataAPI,
  getItemDataAPI,
  updateItemDataAPI,
};
