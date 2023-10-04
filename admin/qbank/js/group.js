import { getGroupListAPI, addGroupAPI, deleteQbankAPI } from "./common_api.js";
import { PER_PAGE } from "./common_params.js";
import {
  generateUUID,
  getDate,
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
    if (confirm("질문 그룹을 만들겠습니까?") === true) {
      addGroup();
    } else {
      return false;
    }
  });

  //목록보기 버튼 클릭
  btn_go_answer_list.addEventListener("click", (event) => {
    window.location.href = "./answer_list.html";
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
          <td class="col-7 text-start ps-4">
            <a href="./question.html?group_uuid=${item.group_uuid}" id="${
        item.group_uuid
      }">${item.group_title}</a>
          </td>
          <td class="col-2">${getDate(item.datetime)}</td>
          <td class="col-2">
          <button type="button" id="btn_group_delete" class="btn btn-outline-dark">
            삭제
          </button>
          </td>
        </tr>
      `;
      board_list.insertAdjacentHTML("beforeend", add_content);
    });

    // 카테고리 삭제 버튼
    const btn_group_delete = document.querySelectorAll("#btn_group_delete");
    btn_group_delete.forEach((button) => {
      button.addEventListener("click", (event) => {
        if (
          confirm(
            "해당 질문그룹 답변 데이터들도 모두 삭제됩니다.\n삭제하시겠습니까?"
          ) === true
        ) {
          deleteQbank(event.target);
        } else {
          return false;
        }
      });
    });
  }
  renderPagingNumber(page, per_page, total_count);
}

//질문 그룹 추가
async function addGroup() {
  const group_title = document.querySelector("#group_title").value;
  const questions_count = document.querySelector("#questions_count").value;
  const group_uuid = generateUUID();

  if (group_title === "") {
    alert("질문 그룹명을 입력해주세요.");
    return;
  }

  const board_data = {
    group_uuid: group_uuid,
    group_title: group_title,
    questions_count: questions_count,
  };

  await addGroupAPI(board_data);
  window.location.href = "./group.html";
}

//질문 그룹 삭제
async function deleteQbank(target) {
  const target_group = target.closest("tr").querySelector("a");
  const target_group_uuid = target_group.id;

  await deleteQbankAPI(target_group_uuid);
  prepare();
}
