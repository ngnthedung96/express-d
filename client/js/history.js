$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/pay/show",
        dataType: 'json',
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessToken"),
        },
        success: function (data) {
            renderOrder(data)
            rateProduct(data)
        }
    });
});

function renderOrder(data) {
    const historyContentDiv = document.querySelector('.history-content')
    for (var order of data.orders) {
        const dateOrder = (order.createdAt.split('-').reverse().join('-'))
        const dayDiv = document.createElement('div')
        dayDiv.classList.add('day')
        dayDiv.innerHTML = `
        <h4 class="day-title">Ngày đặt: ${dateOrder}</h4>
            <table class="table table-order">
                <tr>
                    <th class="table__heading"></th>
                    <th class="table__heading">Tên Sản phẩm</th>
                    <th class="table__heading">Số lượng</th>
                    <th class="table__heading">Thành tiền</th>
                </tr>
            </table>
        <h4 style = "text-align: center" class="day-title">Đánh giá sản phẩm</h4>
        <section class="like rating">
  <!-- FIFTH HEART -->
  <input type="radio" id="heart_5" name="like" value="5" />
  <label for="heart_5" title="Five">&#10084;</label>
  <!-- FOURTH HEART -->
  <input type="radio" id="heart_4" name="like" value="4" />
  <label for="heart_4" title="Four">&#10084;</label>
  <!-- THIRD HEART -->
  <input type="radio" id="heart_3" name="like" value="3" />
  <label for="heart_3" title="Three">&#10084;</label>
  <!-- SECOND HEART -->
  <input type="radio" id="heart_2" name="like" value="2" />
  <label for="heart_2" title="Two">&#10084;</label>
  <!-- FIRST HEART -->
  <input type="radio" id="heart_1" name="like" value="1" />
  <label for="heart_1" title="One">&#10084;</label>
</section>`
        historyContentDiv.appendChild(dayDiv)
        const tableDiv = dayDiv.querySelector('.table-order')
        for (var i of JSON.parse(order.detail)) {
            const dayRow = document.createElement('tr')
            dayRow.innerHTML =
                `
                <td class="table__content table-order-img">
                    <img src="${i.img}"
                              alt="">
                </td>
                <td class="table__content table-order-name">${i.name}</td>
                <td class="table__content table-order-number">${i.number} </td>
                <td class="table__content table-order-price">${i.price}</td>
                `
            tableDiv.appendChild(dayRow)
        }
    }
}

function rateProduct() {
    $(".history-content").click(function (e) {
        // e.preventDefault();
        if (e.target.closest(".rate label")) {
            console.log(e.target)
        }
    });
}