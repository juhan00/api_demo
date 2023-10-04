import { getAnswerListAPI } from "./common_api.js";
import { PER_PAGE } from "./common_params.js";
import { getDate, renderPagingNumber } from "../../../utility/utility.js";

//초기 셋팅
prepare();

function prepare() {
  //그룹 리스트 가져오기
  setAnswerList(1, PER_PAGE);
}
å;

//페이지 로드 후
document.addEventListener("DOMContentLoaded", function () {});

async function setAnswerList(page, per_page) {
  try {
    const answer_list_data = await getAnswerListAPI(page, per_page);
    console.log(answer_list_data);
    renderAnswerList(answer_list_data);
  } catch (error) {
    console.error("Error:", error);
  }
}

//게시판 리스트 렌더링
function renderAnswerList(answer_list_data) {
  const board_data = answer_list_data.data;
  const page = answer_list_data.page;
  const per_page = answer_list_data.per_page;
  const total_count = answer_list_data.total_count;

  const board_list = document.querySelector("#answer_list tbody");
  board_list.innerHTML = "";
  if (board_data) {
    board_data.forEach(function (item, index) {
      const add_content = `
        <tr class="border border-top-0 text-center" style="height: 60px">
          <td class="col-1">${(page - 1) * per_page + (index + 1)}</td>
          <td class="col-7 text-start ps-4">
            <a href="./viewer.html?group_uuid=${item.group_uuid}" id="${
        item.group_uuid
      }">${item.group_title}</a>
          </td>
          <td class="col-2">${getDate(item.datetime)}</td>
        </tr>
      `;
      board_list.insertAdjacentHTML("beforeend", add_content);
    });
  }
  renderPagingNumber(page, per_page, total_count);
}
