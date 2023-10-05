import {
  getGroupAPI,
  getQuestionDataAPI,
  getItemDataAPI,
  addAnswerDataAPI,
  addAnswerItemDataAPI,
} from "./common_api.js";
import {
  MULTIPLE_SELECTION,
  SUBJECTIVE,
  QUESTION_MODE,
} from "./common_params.js";
import { generateUUID } from "../../../utility/utility.js";

//초기 셋팅
prepare();
let current_question_num = 0;
let current_group_uuid = "";
let questions_count = 0;
let question_data = [];
let answer_item_data = [];
let question_mode = QUESTION_MODE.create;

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

    // 답변 항목 데이터 가져와서 추가
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
    //항목 체크
    const check_value = checkValueQuestionData();
    if (check_value === false) {
      alert("답변을 입력해주세요.");
      return;
    }

    saveAnswerItemData();
    setQuestion("next");
    // console.log(question_data);
  });

  //이전 버튼 클릭
  btn_question_prev.addEventListener("click", (event) => {
    saveAnswerItemData();
    setQuestion("prev");
    // console.log(question_data);
  });

  //만들기 버튼 클릭
  btn_question_save.addEventListener("click", async (event) => {
    const check_value = checkValueQuestionData();
    if (check_value === false) {
      alert("답변을 입력해주세요.");
      return;
    }

    saveAnswerItemData();

    if (confirm("답변을 제출하시겠습니까?") === true) {
      await createAnswer(answer_item_data);
    } else {
      return false;
    }
  });
});

// //answer_data 서버에 저장하기
// async function createAnswer(answer_item_data) {
//   try {
//     // UUID 생성
//     const answer_uuid = generateUUID();

//     // 그룹 UUID 가져오기
//     const group_uuid = question_data[0].group_uuid;

//     // 그룹 데이터 가져오기
//     const get_group_data = await getGroupAPI(group_uuid);

//     if (!get_group_data) {
//       return;
//     }

//     const new_data = {
//       group_uuid: group_uuid,
//       group_title: get_group_data.group_title,
//       answer_uuid: answer_uuid,
//     };

//     // 답변 데이터 추가
//     await addAnswerDataAPI(new_data);

//     // Promise 배열 생성
//     const promises = [];

//     for (const datas of answer_item_data) {
//       for (const item of datas) {
//         const new_item_data = {
//           answer: item.answer,
//           answer_key: item.key || "",
//           answer_uuid: answer_uuid,
//           question_uuid: item.question_uuid,
//           question_title: item.question_title,
//         };
//         promises.push(addAnswerItemDataAPI(new_item_data));
//       }
//     }
//     // 병렬로 모든 항목 추가
//     await Promise.all(promises);

//     // 리디렉션 코드
//     window.location.href = "./viewer_list.html";
//   } catch (error) {
//     console.error("데이터 추가 중 오류 발생:", error);
//     // 오류 처리 코드 추가
//   }
// }

//answer_data 서버에 저장하기
async function createAnswer(answer_item_data) {
  try {
    const answer_uuid = generateUUID();
    const group_uuid = question_data[0].group_uuid;

    const get_group_data = await getGroupAPI(group_uuid);

    if (!get_group_data) {
      return;
    }

    const new_data = {
      group_uuid: group_uuid,
      group_title: get_group_data.group_title,
      answer_uuid: answer_uuid,
    };

    await addAnswerDataAPI(new_data);

    for (const datas of answer_item_data) {
      for (const item of datas) {
        const new_item_data = {
          answer: item.answer,
          answer_key: item.key || "",
          answer_uuid: answer_uuid,
          question_uuid: item.question_uuid,
          question_title: item.question_title,
          group_uuid: group_uuid,
        };
        await addAnswerItemDataAPI(new_item_data);
      }
    }
    // 리디렉션 코드
    window.location.href = "./viewer_list.html";
  } catch (error) {
    console.error("데이터 추가 중 오류 발생:", error);
    // 오류 처리 코드 추가
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
  const current_question_data = question_data[current_question_num];
  if (question_data.length > 0) {
    //질문 내용
    question_title.innerHTML = `Q. ${current_question_data.question_title}`;

    const items_count_data = current_question_data.items_count;
    renderItems(items_count_data);
  }

  const question_items = document.querySelectorAll(`#question_items .item`);

  if (answer_item_data.length > 0) {
    const current_answer_item_data = answer_item_data[current_question_num];

    if (current_answer_item_data) {
      //주관식 체크
      const is_subjective = isSubjective();

      if (is_subjective) {
        const input_item_text = document.querySelector(`#input_item_text`);
        input_item_text.value =
          answer_item_data[current_question_num][0].answer;
        return;
      }

      question_items.forEach((data, index) => {
        const item_index = index + 1;
        const question_item = document.getElementById(
          `input_item_${item_index}`
        );
        const question_item_key_value = document.getElementById(
          `input_key_${item_index}`
        ).value;
        const question_answer = current_answer_item_data;
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

function checkValueQuestionData() {
  const question_items = document.querySelectorAll(
    "#question_items > .item > input"
  );

  //주관식 체크
  const is_subjective = isSubjective();

  if (is_subjective) {
    const question_input_value = document.querySelector(
      "#question_items input"
    ).value;

    if (question_input_value === "" || question_input_value === undefined) {
      return false;
    }
    return true;
  }

  let checked_value = false;
  for (let i = 0; i < question_items.length; i++) {
    if (question_items[i].checked) {
      checked_value = true;
    }
  }

  if (checked_value === false) {
    return false;
  }
  return true;
}

function saveAnswerItemData() {
  const new_data = [];
  // console.log(question_data);
  const current_question_data = question_data[current_question_num];

  //주관식 체크
  const is_subjective = isSubjective();

  if (is_subjective) {
    const input_item_text = document.querySelector(`#input_item_text`);
    new_data.push({
      question_uuid: current_question_data.question_uuid,
      question_title: current_question_data.question_title,
      answer: input_item_text.value,
    });

    answer_item_data[current_question_num] = new_data;
    return;
  }

  const question_items = document.querySelectorAll(`#question_items .item`);

  question_items.forEach((item, index) => {
    const input_item_title = item.querySelector(
      `input#input_item_${index + 1}`
    );
    const input_item_key = item.querySelector(`input#input_key_${index + 1}`);
    const is_checked = input_item_title.checked;
    if (is_checked) {
      new_data.push({
        question_uuid: current_question_data.question_uuid,
        question_title: current_question_data.question_title,
        answer: input_item_title.value,
        key: input_item_key.value,
      });
    }
  });

  answer_item_data[current_question_num] = new_data;
}

function renderItems(items_count_value) {
  const current_question_data = question_data[current_question_num];
  const question_items = document.querySelector("#question_items");
  const multiple_selection = current_question_data.multiple_selection;

  question_items.innerHTML = "";

  //주관식 체크
  const is_subjective = isSubjective();

  if (is_subjective) {
    let add_content = `
    <input type="text" class="form-control" id="input_item_text" />
    `;
    question_items.insertAdjacentHTML("beforeend", add_content);
  }

  for (let i = 0; i < items_count_value; i++) {
    const question_num = i + 1;
    const item_title = current_question_data.items[i].item_title;
    const item_key = current_question_data.items[i].item_key;

    let add_content = "";

    if (multiple_selection === MULTIPLE_SELECTION.true) {
      add_content = `
        <div class="item border rounded-3 p-3 pt-3 mt-3 mb-3">
          <div class="row">
            <div class="col">${item_title}</div>
          </div>
          <input type="checkbox" class="form-control" value="${item_title}" id="input_item_${question_num}" hidden />
          <input type="checkbox" class="form-control" value="${item_key}" id="input_key_${question_num}" hidden />
        </div>
      `;
    } else {
      add_content = `
        <div class="item border rounded-3 p-3 pt-3 mt-3 mb-3">
          <div class="row">
            <div class="col">${item_title}</div>
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

function isSubjective() {
  const current_question_data = question_data[current_question_num];
  if (current_question_data.subjective === SUBJECTIVE.true) {
    return true;
  }
  return false;
}
