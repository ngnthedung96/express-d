$(document).ready(function () {
  if (localStorage.getItem("accessToken")) {
    $.ajax({
      type: "GET",
      url: "http://localhost:3333/api/admins/showusers",
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessToken"),
      },
      success: function (data) {
        renderUsers(data)
        haveAdminLogin(data)
      }
    });
  }
  else {
    window.open('/admin/page-error-400.html')
  }
});


function renderUsers(data) {
  const bodyTable = document.querySelector('.table-users .table tbody')
  var htmls = ''
  var count = 1
  for (var user of data.user) {
    htmls += `
    <tr>
      <th>${count}</th>
      <td>${user.email}</td>
      <td>${user.id}
      </td>
      <td>${user.password}</td>
      <td class="color-primary">${user.createdAt}</td>
    </tr>
        `
    count++
  }
  bodyTable.innerHTML = htmls

}

function haveAdminLogin(data) {
  const loginDiv = document.querySelector(".header-right.login-register")
  loginDiv.classList.add('hide')
  const adminEmailDiv = document.querySelector('.icons.dropdown')
  const adminEmailText = document.querySelector('.icons.dropdown .user-email')
  adminEmailDiv.classList.remove('hide')
  $.ajax({
    type: "GET",
    url: `http://localhost:3333/api/admins/infor/${data.id}`,
    success: function (data) {
      adminEmailText.innerText = data.admin.email
    }

  });

}