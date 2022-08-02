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
        }
    });
});

function renderOrder(data) {
    const historyContentDiv = document.querySelector('.history-content')
    for (var order of data.orders) {
        const date = (order.date.split('-').reverse().join('-'))
        const dayDiv = document.createElement('div')
        dayDiv.classList.add('day')
        dayDiv.innerHTML = `
        <h4 class="day-title">Ngày nhận: ${date}</h4>
            <table class="table table-order">
                <tr>
                    <th class="table__heading"></th>
                    <th class="table__heading">Tên Sản phẩm</th>
                    <th class="table__heading">Số lượng</th>
                    <th class="table__heading">Thành tiền</th>
                </tr>
            </table>`
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