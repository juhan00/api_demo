async function prepare() {
  //카테고리 가져오기
  category_data = await getCategoryListAPI();
  renderCategorySelect(category_data);
}

//카테고리 탭 가져오기
async function getCategoryListAPI() {
  try {
    const response = await fetch(
      `http://localhost/api_demo/api/category/?board_name=${board_name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      // console.log(result);
      return result;
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//카테고리 드롭박스 렌더링
function renderCategorySelect(category_data) {
  const select_category = document.querySelector("#select_category");
  select_category.innerHTML = "";

  category_data.forEach(function (item, index) {
    const add_content = `
      <option value="${item.category_uuid}">${item.name}</option>
      `;
    select_category.insertAdjacentHTML("beforeend", add_content);
  });
}
