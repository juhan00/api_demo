import { handleButtonClick } from "../../../utility/utility.js";

//페이지 로드 후
document.addEventListener("DOMContentLoaded", function () {
  //이메일 보내기
  async function sendMailAPI(board_data) {
    try {
      const title = document.querySelector("#input_title").value;
      const content = document.querySelector("#textarea_content").value;
      const phone = document.querySelector("#input_phone").value;
      const email = document.querySelector("#input_email").value;

      const board_data = {
        title: title,
        content: content,
        phone: phone,
        email: email,
      };

      const response = await fetch(`../../api/send_mail/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: board_data.title,
          content: board_data.content,
          phone: board_data.phone,
          email: board_data.email,
        }),
      });

      if (response.ok) {
        alert("이메일 전송 완료");
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  //저장 버튼 클릭
  const btn_save = document.querySelector("#btn_save");
  btn_save.addEventListener("click", async (event) => {
    handleButtonClick(btn_save, sendMailAPI);
  });
});
