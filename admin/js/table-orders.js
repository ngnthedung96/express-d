$(document).ready(function () {
    console.log(1)
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/admins/showorder",
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessToken"),
        },
        success: function (data) {
            renderOrders(data)

        }
    });
});

function renderOrders(data) {
    var countTable = 1
    const tableBody = document.querySelector('.table-orders tbody')
    for (var i of data.orders) {
        const tableRow = document.createElement('tr')
        const dateCreate = i.createdAt
        const dateReceive = (i.date.split('-').reverse().join('-'))
        const userId = i.user_id
        const totalPrice = i.price
        var userEmail
        $.ajax({
            async: false,
            type: "GET",
            url: `http://localhost:3333/api/admins/getuser/${userId}`,
            dataType: "json",
            success: function (data) {
                userEmail = data.user.email
            }
        });
        const detail = i.detail
        tableRow.innerHTML = `
        <td class="count">${countTable}
        </td>
        <td class="email">${userEmail}</td>
        <td><span class="dateCreate">${dateCreate}</span>
        </td>
        <td class="products-col">
            
        </td>
        <td class = "total-price">${totalPrice}</td>
        <td><span class="label gradient-1 rounded">Paid</span>
        </td>
        <td class="dateReceive">${dateReceive}</td>
        `
        const product = tableRow.querySelector('.products-col')
        for (var j of JSON.parse(detail)) {
            const productDiv = document.createElement('div')
            productDiv.classList.add('product')
            productDiv.innerHTML = `
                <img src=${j.img}
                    alt="">
                <p>${j.name}</p>
            `
            product.appendChild(productDiv)
        }
        tableBody.appendChild(tableRow)
        countTable++
    }
}   