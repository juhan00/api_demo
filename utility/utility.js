//datetime을 date로 변환
function getDate(datetime) {
  // Date 객체로 변환
  const db_date = new Date(datetime);

  // 날짜 정보만 추출
  const year = db_date.getFullYear();
  const month = db_date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌
  const day = db_date.getDate();

  // 날짜 정보를 원하는 형식으로 표시
  const formatted_date = `${year}.${month}.${day}`;
  return formatted_date;
}

//category id 생성
function generateCategoryID() {
  let d = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); // 추가적인 고정값을 현재 시간에 더해 더 높은 고유성을 확보합니다.
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

//UUID 생성
function generateUUID() {
  let d = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); // 추가적인 고정값을 현재 시간에 더해 더 높은 고유성을 확보합니다.
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

//url 파라미터 값 가져오기
function getParameterFromURL(parameterName) {
  const currentURL = window.location.href;
  const queryString = currentURL.split("?")[1];
  const paramsArray = queryString.split("&");
  const params = {};

  paramsArray.forEach((param) => {
    const [key, value] = param.split("=");
    params[key] = value;
  });

  return params[parameterName];
}

// key 기준으로 객체들을 그룹화하는 함수
function getGroupByData(arr, key) {
  return arr.reduce((result, obj) => {
    (result[obj[key]] = result[obj[key]] || []).push(obj);
    return result;
  }, {});
}

// 공통 버튼 클릭 이벤트 핸들러
function handleButtonClick(button, callback, is_button_clicked = false) {
  button.addEventListener("click", async (event) => {
    if (is_button_clicked) {
      return;
    }

    // 버튼을 비활성화
    button.disabled = true;
    is_button_clicked = true;

    try {
      await callback();

      // API 작업 완료 후 버튼을 다시 활성화
      button.disabled = false;
    } catch (error) {
      // API 작업 중 오류 발생 시 다시 시도할 수 있도록 플래그 재설정
      button.disabled = false;
      is_button_clicked = false;
      console.error("API 호출 중 오류 발생:", error);
    }
  });
}

export {
  getDate,
  generateCategoryID,
  generateUUID,
  getParameterFromURL,
  getGroupByData,
  handleButtonClick,
};