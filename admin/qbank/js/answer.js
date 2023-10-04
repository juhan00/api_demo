import { getAnswerAPI, getAnswerItemAPI } from "./common_api.js";
import { QUESTION_MODE } from "./common_params.js";

//초기 셋팅
prepare();
let answer_data = [];

async function prepare() {
  const current_url = window.location.href;
  const url = new URL(current_url); // URL 객체 생성
  const params = url.searchParams; // searchParams를 사용하여 쿼리 매개변수 추출
  const answer_uuid = params.get("answer_uuid");
  const get_answer_data = await getAnswerAPI(answer_uuid);
  const get_answer_item_data = await getAnswerItemAPI(answer_uuid);

  // question_uuid를 기준으로 데이터 재정렬
  const sorted_item_data = get_answer_item_data.reduce((acc, item) => {
    const key = item.question_uuid;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  // 결과를 배열로 변환
  const item_result = Object.values(sorted_item_data);

  setGroupTitle(get_answer_data[0].group_title);
  renderItems(item_result);
}

//페이지 로드 후
document.addEventListener("DOMContentLoaded", function () {
  const btn_go_answer_list = document.querySelector("#btn_go_answer_list");

  //목록보기 버튼 클릭
  btn_go_answer_list.addEventListener("click", (event) => {
    window.location.href = "./answer_list.html";
  });
});

function setGroupTitle(title) {
  const group_title = document.querySelector("#group_title_text");
  group_title.innerHTML = `${title}`;
}

function renderItems(item_result) {
  const answer = document.querySelector("#answer");

  answer.innerHTML = "";

  item_result.forEach((question, index) => {
    const question_title = question[0].question_title;

    const questionContent = `
      <div class="title mb-2 fw-bold text-primary">
        질문${index + 1}
      </div>
      <div class="title mb-2 fs-5 fw-bold">
        Q. ${question_title}
      </div>
      <div id="answer_items">
        ${question
          .map(
            (item) => `
          <div class="item border rounded-3 p-3 pt-3 mt-3 mb-3">
            ${item.answer}
          </div>
        `
          )
          .join("")}
      </div>
    `;

    answer.insertAdjacentHTML("beforeend", questionContent);
  });
}
