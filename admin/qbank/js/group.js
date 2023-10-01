import { getGroupListAPI, addGroupAPI } from "./common_api.js";
import { PER_PAGE } from "./common_params.js";
import {
  generateUUID,
  getDate,
  generateCategoryID,
  renderPagingNumber,
} from "../../../utility/utility.js";

//초기 셋팅
prepare();

function prepare() {
  //그룹 리스트 가져오기
  setGroupList(1, PER_PAGE);
}

//페이지 로드 후
document.addEventListener("DOMContentLoaded", function () {
  //만들기 버튼 클릭
  const btn_group_save = document.querySelector("#btn_group_save");
  btn_group_save.addEventListener("click", (event) => {
    addGroup();
  });
});

async function setGroupList(page, per_page) {
  try {
    const group_list_data = await getGroupListAPI(page, per_page);
    renderGroupList(group_list_data);
  } catch (error) {
    console.error("Error:", error);
  }
}

//게시판 리스트 렌더링
function renderGroupList(group_list_data) {
  const board_data = group_list_data.data;
  const page = group_list_data.page;
  const per_page = group_list_data.per_page;
  const total_count = group_list_data.total_count;

  const board_list = document.querySelector("#group_list tbody");
  board_list.innerHTML = "";
  if (board_data) {
    board_data.forEach(function (item, index) {
      const add_content = `
        <tr class="border border-top-0 text-center" style="height: 60px">
          <td class="col-1">${(page - 1) * per_page + (index + 1)}</td>
          <td class="col-9 text-start ps-4">
            <a href="./question.html?group_uuid=${item.group_uuid}">${
        item.group_title
      }</a>
          </td>
          <td class="col-1">${getDate(item.datetime)}</td>
        </tr>
      `;
      board_list.insertAdjacentHTML("beforeend", add_content);
    });
  }
  renderPagingNumber(page, per_page, total_count);
}

//게시판 글 추가
async function addGroup() {
  const group_title = document.querySelector("#group_title").value;
  const questions_count = document.querySelector("#questions_count").value;
  const group_uuid = generateUUID();

  const board_data = {
    group_uuid: group_uuid,
    group_title: group_title,
    questions_count: questions_count,
  };

  await addGroupAPI(board_data);
  window.location.href = "./group.html";
}
