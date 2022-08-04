$(document).ready(function () {
  if (localStorage.getItem("accessToken")) {
    $.ajax({
      type: "GET",
      url: "http://localhost:3333/api/admins/showitems",
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessToken"),
      },
      success: function (data) {
        renderProducts(data)
        haveAdminLogin(data)
      }
    });
  }
  else {
    window.open('/admin/page-error-400.html')
  }
});


function renderProducts(data) {
  const bodyTable = document.querySelector('.table-products .table tbody')
  var count = 1
  for (var product of data.items) {
    const rowDiv = document.createElement('tr')
    rowDiv.innerHTML = `
      <th class = "count">
      <p>${count} </p>
      </th>
      <td>${product.name}</td>
      <td>${product.id}
      </td>
      <td>${product.price}</td>
        `
    const imgCol = document.createElement('td')
    for (var img of JSON.parse(product.img)) {
      const imgOfCol = document.createElement('img')
      imgOfCol.src = img
      imgCol.appendChild(imgOfCol)
    }
    rowDiv.appendChild(imgCol)
    bodyTable.appendChild(rowDiv)
    count++
  }
}

function haveAdminLogin(data) {
  console.log(data)
  const loginDiv = document.querySelector(".header-right.login-register")
  loginDiv.classList.add('hide')
  const adminEmailDiv = document.querySelector('.icons.dropdown')
  const adminEmailText = document.querySelector('.icons.dropdown .user-email')
  adminEmailDiv.classList.remove('hide')
  $.ajax({
    type: "GET",
    url: `http://localhost:3333/api/admins/infor/${data.id}`,
    success: function (data) {
      console.log(data)
      adminEmailText.innerText = data.admin.email
    }

  });

}