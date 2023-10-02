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
  deepEqual,
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
let answer_data = [];
let question_mode = QUESTION_MODE.create;

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
  const btn_go_viewer_list = document.querySelector("#btn_go_viewer_list");
  const btn_question_next = document.querySelector("#btn_question_next");
  const btn_question_prev = document.querySelector("#btn_question_prev");
  const btn_question_save = document.querySelector("#btn_question_save");

  //목록보기 버튼 클릭
  btn_go_viewer_list.addEventListener("click", (event) => {
    window.location.href = "./viewer_list.html";
  });

  //다음 버튼 클릭
  btn_question_next.addEventListener("click", (event) => {
    // //항목 체크
    // const check_value = checkValueQuestionData();
    // if (check_value === false) {
    //   return;
    // }

    saveAnswerData();
    setQuestion("next");
    // console.log(question_data);
  });

  //이전 버튼 클릭
  btn_question_prev.addEventListener("click", (event) => {
    // //항목 체크
    // const check_value = checkValueQuestionData();
    // if (check_value === false) {
    //   return;
    // }

    saveAnswerData();
    setQuestion("prev");
    // console.log(question_data);
  });

  //만들기 버튼 클릭
  btn_question_save.addEventListener("click", async (event) => {
    // //항목 체크
    // const check_value = checkValueQuestionData();
    // if (check_value === false) {
    //   return;
    // }

    saveQuestionData();

    if (confirm("질문을 생성 하시겠습니까?") === true) {
      await createQuestionAndItem(question_data);
      console.log("저장");
    } else {
      return false;
    }
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

    await deleteItemDataAPI(data.question_uuid);
    if (Array.isArray(data.items)) {
      for (const item of data.items) {
        await addItemDataAPI(item);
      }
    }
  }

  //질문 별 함수 호출
  async function updateQuestionData(question_data) {
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
  // resetQuestion();
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
    btn_question_save.style.display = "block";
  } else {
    if (current_question_num > 0) {
      btn_question_prev.style.display = "block";
    } else {
      btn_question_prev.style.display = "none";
    }
    btn_question_next.style.display = "block";
    btn_question_save.style.display = "none";
  }
}

function setQuestionData() {
  const question_title = document.querySelector("#question_title");

  if (question_data.length > 0) {
    const current_question_data = question_data[current_question_num];
    // const current_question_data_item_length =
    //   current_question_data.items.length;

    //질문 내용
    question_title.innerHTML = current_question_data.question_title;

    const items_count_data = current_question_data.items_count;
    renderItems(items_count_data);
  }

  const question_items = document.querySelectorAll(`#question_items .item`);
  if (answer_data.length > 0) {
    const current_answer_data = answer_data[current_question_num];
    if (current_answer_data) {
      question_items.forEach((item, index) => {
        const item_index = index + 1;
        const question_item = document.getElementById(
          `input_item_${item_index}`
        );
        const question_item_key_value = document.getElementById(
          `input_key_${item_index}`
        ).value;
        const question_answer = current_answer_data.question_answer;

        if (
          question_answer.some((item) => question_item_key_value === item.key)
        ) {
          question_item.checked = true;
        }
      });
      itemCheckedActive();
    }
  }
}

function setGroupTitle(title) {
  const group_title = document.querySelector("#group_title_text");
  group_title.innerHTML = `${title}`;
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

// function selectedItem(value) {
//   const select_item = items_count.querySelector(`option[value="${value}"]`);
//   select_item.selected = true;
// }

// function subjectiveChange(option) {
//   const subjective = document.querySelector("#subjective");
//   if (option === true) {
//     subjective.checked = true;
//   } else {
//     subjective.checked = false;
//   }
// }

// function checkValueQuestionData() {
//   const question_items = document.querySelectorAll(
//     "#question_items > .item > input"
//   );

//   let checkedValue = false;
//   for (let i = 0; i < question_items.length; i++) {
//     if (question_items[i].checked) {
//     }
//   }
//   return;
// }

function saveAnswerData() {
  const question_items = document.querySelectorAll(`#question_items .item`);

  const new_data = {
    question_uuid: question_data[current_question_num].question_uuid,
    group_uuid: question_data[current_question_num].group_uuid,
    question_title: question_data[current_question_num].question_title,
    question_answer: [],
  };

  // console.log(question_data);

  question_items.forEach((item, index) => {
    const input_item_title = item.querySelector(
      `input#input_item_${index + 1}`
    );
    const input_item_key = item.querySelector(`input#input_key_${index + 1}`);
    const is_checked = input_item_title.checked;
    if (is_checked) {
      new_data.question_answer.push({
        answer: input_item_title.value,
        key: input_item_key.value,
      });
    }
  });

  answer_data[current_question_num] = new_data;

  console.log(answer_data);
}

// function resetQuestion() {
//   const question_title = document.querySelector("#question_title");

//   //질문 내용
//   question_title.value = "";
// }

function renderItems(items_count_value) {
  const question_items = document.querySelector("#question_items");
  const multiple_selection =
    question_data[current_question_num].multiple_selection;

  question_items.innerHTML = "";

  // if (!items_count_value && items_count_value !== 0) {
  //   items_count_value = default_items_count;
  // }

  for (let i = 0; i < items_count_value; i++) {
    const question_num = i + 1;
    const item_title = question_data[current_question_num].items[i].item_title;
    const item_key = question_data[current_question_num].items[i].item_key;

    let add_content = "";

    if (multiple_selection === MULTIPLE_SELECTION.true) {
      add_content = `
        <div class="item border rounded-3 p-3 pt-3 mt-3 mb-3">
          <div class="row">
            <div class="col-auto">${question_num}</div>
            <div class="col p-0">${item_title}</div>
          </div>
          <input type="checkbox" class="form-control" value="${item_title}" id="input_item_${question_num}" hidden />
          <input type="checkbox" class="form-control" value="${item_key}" id="input_key_${question_num}" hidden />
        </div>
      `;
    } else {
      add_content = `
        <div class="item border rounded-3 p-3 pt-3 mt-3 mb-3">
          <div class="row">
            <div class="col-auto">${question_num}</div>
            <div class="col p-0">${item_title}</div>
          </div>
          <input type="radio" class="form-control" value="${item_title}" id="input_item_${question_num}" name="input_item" hidden />
          <input type="radio" class="form-control" value="${item_key}" id="input_key_${question_num}" hidden />
        </div>
      `;
    }

    question_items.insertAdjacentHTML("beforeend", add_content);
  }
  //답변 아이템 클릭
  const btn_item = document.querySelectorAll("#question_items .item");
  btn_item.forEach((button) => {
    button.addEventListener("click", () => {
      toggleItem(button);
    });
  });
}

function toggleItem(item) {
  const item_input = item.querySelector("input");
  const is_checked = item.querySelector("input").checked;
  if (is_checked) {
    // console.log("체크해제");
    item_input.checked = false;
    itemCheckedActive();
  } else {
    // console.log("체크처리");
    item_input.checked = true;
    itemCheckedActive();
  }
}

function itemCheckedActive() {
  const question_item = document.querySelectorAll("#question_items .item");
  question_item.forEach((item, index) => {
    const is_checked = item.querySelector(
      `input#input_item_${index + 1}`
    ).checked;
    if (is_checked) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}
