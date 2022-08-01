//------------------------API--------------------------
$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "http://localhost:3333/api/cart/show",
    dataType: "json",
    headers: {
      token: 'Bearer ' + localStorage.getItem("accessToken"),
    },
    success: function (data) {
      if (data.status) {
        renderProducts(data)
        deleteOrder()
        handleTotalPrice(data)
        pay()
      }
    }
  });
});



function handleTotalPrice(data) {
  $(".table-order").click(function (e) {
    e.preventDefault();
    if (e.target.closest(".prev")) {
      e.preventDefault();
      const parentOfRow = e.target.parentElement.parentElement.parentElement
      const priceDiv = parentOfRow.querySelector('.table-order-price').innerText
      var price = []
      for (i of priceDiv.split('')) {
        if (i != "đ" && i != ",") {
          price.push(i)
        }
      }
      const parentElement = e.target.parentElement
      const inputNumber = parentElement.querySelector('.number')
      var valueOfInput = inputNumber.value
      if (valueOfInput != 1) {
        inputNumber.value = valueOfInput - 1
      }
      const totalPrice = parentOfRow.querySelector(".table-order-total")
      var a = Number(price.join('')) * Number(inputNumber.value)
      var container = `${a}`.split('').reverse()
      var b = []
      var count = 0
      for (i of container) {
        count++
        if (count === 3) {
          count = 0
          b.push(i)
          b.push(',')
        }
        else {
          b.push(i)
        }
      }
      if (b.reverse()[0] === ',') {
        totalPrice.innerText = (b.slice(1, b.length)).join('') + 'đ'
      }
      else {
        totalPrice.innerText = b.join('') + 'đ'
      }
    }
    else if (e.target.closest(".next")) {
      e.preventDefault();
      const parentOfRow = e.target.parentElement.parentElement.parentElement
      const priceDiv = parentOfRow.querySelector('.table-order-price').innerText
      var price = []
      for (i of priceDiv.split('')) {
        if (i != "đ" && i != ",") {
          price.push(i)
        }
      }
      const parentElement = e.target.parentElement
      const inputNumber = parentElement.querySelector('.number')
      var valueOfInput = inputNumber.value
      inputNumber.value = Number(valueOfInput) + 1
      const totalPrice = parentOfRow.querySelector(".table-order-total")
      var a = Number(price.join('')) * Number(inputNumber.value)
      var container = `${a}`.split('').reverse()
      var b = []
      var count = 0
      for (i of container) {
        count++
        if (count === 3) {
          count = 0
          b.push(i)
          b.push(',')
        }
        else {
          b.push(i)
        }
      }
      if (b.reverse()[0] === ',') {
        totalPrice.innerText = (b.slice(1, b.length)).join('') + 'đ'
      }
      else {
        totalPrice.innerText = b.join('') + 'đ'
      }
    }
    //default
    const number = document.querySelector('.numberOrder .number')
    number.addEventListener('input', function () {
      const parentOfRow = (this.parentElement.parentElement.parentElement)
      const inputNumber = parentOfRow.querySelector('.number')
      const priceDiv = parentOfRow.querySelector('.table-order-price').innerText
      var price = []
      for (i of priceDiv.split('')) {
        if (i != "đ" && i != ",") {
          price.push(i)
        }
      }
      if (number.value) {
        const totalPrice = parentOfRow.querySelector(".table-order-total")
        var a = Number(price.join('')) * Number(inputNumber.value)
        var container = `${a}`.split('').reverse()
        var b = []
        var count = 0
        for (i of container) {
          count++
          if (count === 3) {
            count = 0
            b.push(i)
            b.push(',')
          }
          else {
            b.push(i)
          }
        }
        if (b.reverse()[0] === ',') {
          totalPrice.innerText = (b.slice(1, b.length)).join('') + 'đ'
        }
        else {
          totalPrice.innerText = b.join('') + 'đ'
        }
      }
    })
    totalPrice()
  });
  totalPrice()
}

function totalPrice() {
  var prices = document.querySelectorAll(".table-order-total")
  var price = []
  for (var i of prices) {
    var container = []
    for (j of i.innerText.split('')) {
      if (j != "đ" && j != ",") {
        container.push(j)
      }
    }
    price.push(container.join(''))
  }
  var total = 0
  for (i of price) {
    total += Number(i)
  }
  var totalPriceDiv = document.querySelector(".total-price")
  var container = `${total}`.split('').reverse()
  var b = []
  var count = 0
  for (i of container) {
    count++
    if (count === 3) {
      count = 0
      b.push(i)
      b.push(',')
    }
    else {
      b.push(i)
    }
  }
  if (b.reverse()[0] === ',') {
    totalPriceDiv.innerText = (b.slice(1, b.length)).join('') + 'đ'
  }
  else {
    totalPriceDiv.innerText = b.join('') + 'đ'
  }
}



function deleteOrder() {
  $("table").click(function (e) {
    e.preventDefault();
    var btnDelete = e.target.closest(".table-order-delete")
    if (btnDelete) {
      var parentEl
      var element = e.target.parentElement
      while (element) {
        if (element.matches('.table-order-row')) {
          parentEl = element
          break
        }
        element = element.parentElement
      }
      const id = Number(parentEl.querySelector('.table-order-cart-id').innerText)
      $.ajax({
        type: "POST",
        url: "http://localhost:3333/api/cart/delete",
        data: {
          "id": id
        },
        dataType: "json",
        success: function (response) {
          alert("xóa sản phẩm thành công")
          location.reload()
        }
      });
    }
  });
}



function pay() {
  $(".btn-buy").click(function (e) {
    var checkOrder = document.querySelector(".cart-content h2.hide")
    if (checkOrder) {
      e.preventDefault();
      const orders = document.querySelectorAll(".table-order-row")
      console.log(orders)
      const container = []
      for (i of orders) {
        const user_id = i.querySelector(".table-order-user-id").innerText
        const item_id = i.querySelector(".table-order-item-id").innerText
        const name = i.querySelector(".table-order-name").innerText
        const price = i.querySelector(".table-order-total").innerText
        const number = i.querySelector(".numberOrder .number").value
        const block = {
          user_id,
          item_id,
          name,
          price,
          number,
        }
        container.push(block)
      }
      const user_id = document.querySelector(".table-order-user-id").innerText
      const note = document.querySelector(".cart-footer #note").value
      const date = document.querySelector(".cart-footer #date").value
      const time = document.querySelector(".cart-footer #time").value
      console.log(container)
      //   $.ajax({
      //     type: "POST",
      //     url: "http://localhost:3333/api/pay/create",
      //     data: {
      //       user_id,
      //       detail: container
      //     }
      //     ,
      //     dataType: "json",
      //     success: function (data) {
      //       console.log(data)
      //       location.reload()
      //     }
      //   });
      //   alert("thanh toán thành công")
    }
    else {
      alert("bạn cần chọn sản phẩm")
    }

  });


}





function renderProducts(data) {
  const table = document.querySelector(".table-order")
  const noItem = document.querySelector(".cart-content h2")
  if (data.products.length > 0) {
    noItem.classList.add('hide')
    for (var i of data.products) {
      const row = document.createElement("tr")
      row.classList.add("table-order-row")
      var htmls = `
        <td class="table__content table-order-img">
            <img src="${i.img}"
                              alt="">
        </td>
        <td class="table__content table-order-item-id hide">${i.item_id}</td>
        <td class="table__content table-order-cart-id hide">${i.id}</td>
        <td class="table__content table-order-user-id hide">${i.user_id}</td>
        <td class="table__content table-order-name">${i.name}</td>
        <td class="table__content table-order-price">${i.price}</td>
        <td class="table__content table-order-number">
          <div class="numberOrder">
            <input type="button" class="prev" value="-"></input>
            <input type="number" class="number" value="1" min="1"></input>
            <input type="button" class="next" value="+"></input>
          </div>
        </td>
        <td class="table__content table-order-total">${i.price}</td>
        <td class="table__content table-order-delete">
          <i class="fa-solid fa-x"></i>
        </td>
        `
      row.innerHTML = htmls
      table.appendChild(row)
    }
  }
}


