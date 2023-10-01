import {
  getGroupAPI,
  addQuestionDataAPI,
  getQuestionDataAPI,
  addItemDataAPI,
  getItemDataAPI,
  updateQuestionDataAPI,
  deleteItemDataAPI,
  updateItemDataAPI,
} from "./common_api.js";
import {
  MULTIPLE_SELECTION,
  SUBJECTIVE,
  QUESTION_MODE,
} from "./common_params.js";
import {
  generateUUID,
  getDate,
  generateCategoryID,
  renderPagingNumber,
} from "../../../utility/utility.js";

//초기 셋팅
prepare();
let current_question_num = 0;
let current_group_uuid = "";
let questions_count = 0;
let question_data = [];
let question_mode = QUESTION_MODE.create;
// // items 프로퍼티가 없을 때 추가
// if (!question_data.hasOwnProperty("items")) {
//   question_data.items = [];
// }

const default_items_count = 4;

async function prepare() {
  const current_url = window.location.href;
  const url = new URL(current_url); // URL 객체 생성
  const params = url.searchParams; // searchParams를 사용하여 쿼리 매개변수 추출
  const group_uuid = params.get("group_uuid");
  const get_group_data = await getGroupAPI(group_uuid);
  const get_question_data = await getQuestionDataAPI(group_uuid);

  //질문 데이터 추가
  if (get_question_data.length) {
    //데이터가 있으면 edit 모드로
    question_mode = QUESTION_MODE.edit;
    // question_data = get_question_data;
    get_question_data.forEach((data) => {
      question_data.push(data);
    });

    //items 배열 초기화
    question_data.forEach((data) => {
      data.items = [];
    });

    // 답변 데이터 가져와서 추가
    await Promise.all(
      get_question_data.map(async (data) => {
        try {
          const question_uuid = data.question_uuid;
          const get_item_data = await getItemDataAPI(question_uuid);

          console.log(get_item_data);
          // items 배열 초기화 및 데이터 추가
          data.items = get_item_data || [];
        } catch (error) {
          console.error("Error fetching item data:", error);
          // 에러 처리: 실패한 경우 items 배열을 빈 배열로 초기화
          data.items = [];
        }
      })
    );
  }

  current_group_uuid = group_uuid;
  questions_count = get_group_data.questions_count;

  renderNavi(questions_count);
  setGroupTitle(get_group_data.group_title);
  setQuestion();
}

//페이지 로드 후
document.addEventListener("DOMContentLoaded", function () {
  const btn_question_next = document.querySelector("#btn_question_next");
  const btn_question_prev = document.querySelector("#btn_question_prev");
  const btn_question_save = document.querySelector("#btn_question_save");
  const btn_question_update = document.querySelector("#btn_question_update");
  const items_count = document.querySelector("#items_count");
  const subjective = document.querySelector("#subjective");

  let items_count_value = items_count.value;
  // //답변 생성
  // renderItems(default_items_count);
  // //이전 버튼 처리
  // setButton();

  //답변 개수 변경 시
  items_count.addEventListener("change", (event) => {
    // 선택된 옵션의 값 가져오기
    items_count_value = Number(items_count.value);
    if (items_count_value === 0) {
      subjectiveChange(true);
    } else {
      subjectiveChange(false);
    }
    renderItems(items_count_value);
  });

  //주관식 체크 변경 시
  subjective.addEventListener("change", (event) => {
    // 선택된 옵션의 값 가져오기
    if (subjective.checked) {
      renderItems(0);
      selectedItem(0);
    } else {
      // renderItems(default_items_count);
      selectedItem(default_items_count);
    }
  });

  //다음 버튼 클릭
  btn_question_next.addEventListener("click", (event) => {
    saveQuestionData();
    setQuestion("next");
    // console.log(question_data);
  });

  //이전 버튼 클릭
  btn_question_prev.addEventListener("click", (event) => {
    saveQuestionData();
    setQuestion("prev");
    // console.log(question_data);
  });

  //저장하기 버튼 클릭
  btn_question_save.addEventListener("click", async (event) => {
    saveQuestionData();
    createQuestionAndItem(question_data);
    console.log("저장");
  });

  //업데이트 버튼 클릭
  btn_question_update.addEventListener("click", async (event) => {
    saveQuestionData();
    // console.log(question_data);
    updateQuestionAndItem(question_data);
    console.log("업데이트");
  });
});

//question_data 서버에 저장하기
async function createQuestionAndItem(question_data) {
  try {
    await createQuestionData(question_data);
    // 리디렉션 코드
    // window.location.href = "./group.html";
  } catch (error) {
    console.error("데이터 추가 중 오류 발생:", error);
    // 오류 처리 코드 추가
  }

  //질문 데이터 & 답변 데이터 추가
  async function createDataToAPI(data) {
    await addQuestionDataAPI(data);
    if (Array.isArray(data.items)) {
      for (const item of data.items) {
        await addItemDataAPI(item);
      }
    }
  }

  //질문 별 함수 호출
  async function createQuestionData(question_data) {
    for (const data of question_data) {
      await createDataToAPI(data);
    }
  }
}

// //question_data 서버에 저장하기
// async function updateQuestionAndItem(question_data) {
//   try {
//     await updateQuestionData(question_data);
//     // 리디렉션 코드
//     // window.location.href = "./group.html";
//   } catch (error) {
//     console.error("데이터 추가 중 오류 발생:", error);
//     // 오류 처리 코드 추가
//   }

//   //질문 데이터 & 답변 데이터 추가
//   async function updateDataToAPI(data) {
//     await updateQuestionDataAPI(data);

//     await deleteItemDataAPI(data.question_uuid);
//     if (Array.isArray(data.items)) {
//       for (const item of data.items) {
//         await addItemDataAPI(item);
//       }
//     }
//   }

//   //질문 별 함수 호출
//   async function updateQuestionData(question_data) {
//     console.log("data.question_uuid", question_data);
//     for (const data of question_data) {
//       await updateDataToAPI(data);
//     }
//   }
// }
//question_data 서버에 저장하기
async function updateQuestionAndItem(question_data) {
  try {
    await updateQuestionData(question_data);
    // 리디렉션 코드
    // window.location.href = "./group.html";
  } catch (error) {
    console.error("데이터 추가 중 오류 발생:", error);
    // 오류 처리 코드 추가
  }

  //질문 데이터 & 답변 데이터 추가
  async function updateDataToAPI(data) {
    await updateQuestionDataAPI(data);
    if (Array.isArray(data.items)) {
      for (const item of data.items) {
        console.log("item.id", item.id);
        if (item.id) {
          await updateItemDataAPI(item);
        } else {
          await addItemDataAPI(item);
        }
      }
    }
  }

  //질문 별 함수 호출
  async function updateQuestionData(question_data) {
    console.log("data.question_uuid", question_data);
    for (const data of question_data) {
      await updateDataToAPI(data);
    }
  }
}

function setQuestion(direction) {
  if (direction === "next") {
    current_question_num = current_question_num + 1;
  } else if (direction === "prev") {
    current_question_num = current_question_num - 1;
  }

  setNavi();
  setButton();
  setQuestionTitle();
  resetQuestion();
  renderItems();
  setQuestionData();
}

function setButton() {
  let set_questions_count = 0;
  if (questions_count === 0) {
    set_questions_count = questions_count;
  } else {
    set_questions_count = questions_count - 1;
  }

  if (current_question_num === set_questions_count) {
    if (current_question_num > 0) {
      btn_question_prev.style.display = "block";
    } else {
      btn_question_prev.style.display = "none";
    }
    btn_question_next.style.display = "none";
    if (question_mode === QUESTION_MODE.create) {
      btn_question_save.style.display = "block";
      btn_question_update.style.display = "none";
    } else {
      btn_question_save.style.display = "none";
      btn_question_update.style.display = "block";
    }
  } else {
    btn_question_prev.style.display = "block";
    btn_question_next.style.display = "block";
    btn_question_save.style.display = "none";
    btn_question_update.style.display = "none";
  }
}

function setQuestionData() {
  const question_title = document.querySelector("#question_title");
  const items_count = document.querySelector("#items_count");
  const multiple_selection = document.querySelector("#multiple_selection");
  const subjective = document.querySelector("#subjective");

  if (question_data[current_question_num]) {
    //질문 내용
    question_title.value = question_data[current_question_num].question_title;
    //답변 개수
    items_count.value = question_data[current_question_num].items_count;

    if (
      question_data[current_question_num].multiple_selection ===
      MULTIPLE_SELECTION.true
    ) {
      multiple_selection.checked = true;
    } else {
      multiple_selection.checked = false;
    }

    if (question_data[current_question_num].subjective === SUBJECTIVE.true) {
      subjective.checked = true;
    } else {
      subjective.checked = false;
    }

    const items_count_data = question_data[current_question_num].items_count;
    renderItems(items_count_data);

    if (question_data[current_question_num].items.length) {
      for (let i = 0; i < items_count_data; i++) {
        const item_title = document.querySelector(`#item_title_${i + 1}`);
        const item_key = document.querySelector(`#item_key_${i + 1}`);

        // console.log(
        //   "aaa",
        //   question_data[current_question_num].items[i].item_title
        // );
        item_title.value =
          question_data[current_question_num].items[i].item_title;
        item_key.value = question_data[current_question_num].items[i].item_key;
      }
    }
  }
}

function setGroupTitle(title) {
  const group_title = document.querySelector("#group_title_text");
  group_title.innerHTML = `${title} 질문 만들기`;
}

function setQuestionTitle() {
  const question_title = document.querySelector("#question_title_text");
  question_title.innerHTML = `질문${current_question_num + 1}`;
}

function renderNavi(questions_count) {
  const navi_row = document.querySelector("#navi .row");
  navi_row.innerHTML = "";
  for (let i = 0; i < questions_count; i++) {
    const add_content = `
      <div class="col"></div>
    `;
    navi_row.insertAdjacentHTML("beforeend", add_content);
  }

  const navi_first_col = document.querySelector(
    "#navi .row .col:first-of-type"
  );
  navi_first_col.classList.add("active");
}

function setNavi() {
  const navi_col = document.querySelectorAll(`#navi .row .col`);

  navi_col.forEach((item) => {
    item.classList.remove("active");
  });

  const navi_num_col = document.querySelector(
    `#navi .row .col:nth-of-type(${current_question_num + 1})`
  );
  navi_num_col.classList.add("active");
}

function selectedItem(value) {
  const select_item = items_count.querySelector(`option[value="${value}"]`);
  select_item.selected = true;
}

function subjectiveChange(option) {
  const subjective = document.querySelector("#subjective");
  if (option === true) {
    subjective.checked = true;
  } else {
    subjective.checked = false;
  }
}

function saveQuestionData() {
  const question_title = document.querySelector("#question_title");
  const items_count = document.querySelector("#items_count");
  const multiple_selection = document.querySelector("#multiple_selection");
  const subjective = document.querySelector("#subjective");
  const question_uuid = generateUUID();

  // 질문 내용
  const question_title_value = question_title.value;
  const items_count_value = Number(items_count.value);
  const multiple_selection_value = multiple_selection.checked
    ? MULTIPLE_SELECTION.true
    : MULTIPLE_SELECTION.false;
  const subjective_value = subjective.checked
    ? SUBJECTIVE.true
    : SUBJECTIVE.false;

  const item_values = [];

  let new_data = {};
  const current_question = question_data[current_question_num];
  const current_question_uuid =
    question_data[current_question_num]?.question_uuid || question_uuid;

  new_data = {
    question_uuid: current_question_uuid,
    group_uuid: current_group_uuid,
    question_title: question_title_value,
    items_count: items_count_value,
    multiple_selection: multiple_selection_value,
    subjective: subjective_value,
    items: item_values,
  };

  if (current_question) {
    new_data.id = current_question.id;
  }

  for (let i = 0; i < items_count_value; i++) {
    const item_title = document.getElementById(`item_title_${i + 1}`);
    const item_key = document.getElementById(`item_key_${i + 1}`);

    new_data.items.push({
      id: current_question?.items?.[i]?.id || "", // 기존 객체에서 id 가져오기
      question_uuid: current_question_uuid,
      group_uuid: current_group_uuid,
      item_title: item_title.value,
      item_key: item_key.value,
    });
  }
  question_data[current_question_num] = new_data;
}

function resetQuestion() {
  const question_title = document.querySelector("#question_title");
  const items_count = document.querySelector("#items_count");
  const multiple_selection = document.querySelector("#multiple_selection");
  const subjective = document.querySelector("#subjective");

  //질문 내용
  question_title.value = "";
  //답변 개수
  items_count.value = default_items_count;
  multiple_selection.checked = false;
  subjective.checked = false;
}

function renderItems(items_count_value) {
  const question_items = document.querySelector("#question_items");
  question_items.innerHTML = "";

  if (!items_count_value && items_count_value !== 0) {
    items_count_value = default_items_count;
  }

  for (let i = 0; i < items_count_value; i++) {
    const question_num = i + 1;
    const add_content = `
      <div class="border p-3 pt-3 mt-3 mb-3">
        <div class="row">
          <div class="col">
            <label for="item_title_${question_num}" class="form-label fw-semibold">답변${question_num}</label>
            <input type="text" class="form-control" id="item_title_${question_num}" />
          </div>
          <div class="col-auto">
            <label for="item_key_${question_num}" class="form-label fw-semibold">답변${question_num} KEY</label>
            <input type="text" class="form-control" id="item_key_${question_num}" />
          </div>
        </div>
      </div>
      `;
    question_items.insertAdjacentHTML("beforeend", add_content);
  }
}
