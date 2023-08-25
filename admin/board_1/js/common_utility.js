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

export { getDate, generateCategoryID, generateUUID, getParameterFromURL };
