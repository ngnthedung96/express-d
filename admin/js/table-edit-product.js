$(document).ready(function () {
  if (localStorage.getItem("accessToken")) {
    $.ajax({
      type: "GET",
      url: "http://localhost:3333/api/admins/showitems",
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
      },
      success: function (data) {
        renderProducts(data)
        haveAdminLogin(data)
        editProducts()
      }
    });
  }
  else {
    window.open('/admin/page-error-400.html')
  }
});

function editProducts() {
  $(".table-products tbody").click(function (e) {
    e.preventDefault();
    var parentEl = e.target.closest('tr')
    if (parentEl) {
      const name = parentEl.querySelector(".name").innerText
      const price = parentEl.querySelector(".price").innerText
      const imgs = parentEl.querySelectorAll(".image img")
      const id = parentEl.querySelector(".id").innerText
      var img = []
      for (var i of imgs) {
        img.push(i.src)
      }
      const newName = document.querySelector(".table-edit-products tbody #name")
      const newPrice = document.querySelector(".table-edit-products tbody #price")
      const newImage = document.querySelectorAll(".table-edit-products tbody input[type = 'img']")
      newName.value = name
      newPrice.value = price
      const newImageContainer = []
      for (var i = 0; i < newImage.length; i++) {
        for (var j = 0; j < img.length; j++) {
          if (i === j) {
            newImage[i].value = img[j]
            newImageContainer.push(img[j])
          }
          if (i > j) {
            newImage[i].value = null
          }
        }
      }
      $(".btn-edit-products").click(function (e) {
        e.preventDefault();
        $.ajax({
          type: "PUT",
          url: "http://localhost:3333/api/admins/updateitem",
          data: {
            id: id,
            name: newName.value,
            price: newPrice.value,
            img: newImageContainer
          },
          dataType: "json",
          headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
          },
          success: function (data) {
            console.log(data)
            successFunction(data)
          }
        });

      });
    }
  });
}


function renderProducts(data) {
  const bodyTable = document.querySelector('.table-products .table tbody')
  var count = 1
  for (var product of data.items) {
    const rowDiv = document.createElement('tr')
    rowDiv.innerHTML = `
      <th class = "count">
      <p>${count} </p>
      </th>
      <td class = "name">${product.name}</td>
      <td class = "id">${product.id}
      </td>
      <td class = "price">${product.price}</td>
        `
    const imgCol = document.createElement('td')
    imgCol.classList.add('image')
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
  const loginDiv = document.querySelector(".header-right .default")
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

function logOut() {
  //-------log out--------------
  $('.log-out__btn').click(function (e) {
    e.preventDefault();
    $.ajax({
      url: "http://localhost:3333/api/users/logout",
      type: "POST",
      dataType: 'json',
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
      }
    })
      .done(function (data, textStatus, jqXHR) {
        localStorage.removeItem('accessAdminToken');
        successFunction(data)
        setTimeout(function () {
          location.reload()
        }, 1000)
      })
  });
}

// ------toast---------------
import toast from "./toast.js"
function successFunction(data) {
  if (data.status) {
    toast({
      title: 'Success',
      message: `${data.msg}`,
      type: 'success'
    })
    setTimeout(function () {
      location.reload()
    }, 1500)
  }
}
function errorFunction(message) {
  toast({
    title: 'Error',
    message: `${message}`,
    type: 'error'
  })
}