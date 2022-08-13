$(document).ready(function () {
    if (localStorage.getItem("accessAdminToken")) {
        $.ajax({
            type: "GET",
            url: "http://localhost:3333/api/admins/home",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                haveAdminLogin(data)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://localhost:3333/api/pay/showall",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                renderNumberProduct(data)
                renderNetProfit(data)
            }
        });
    }
    else {
        window.open('/admin/page-error-400.html')
    }
});




function haveAdminLogin(data) {
    const loginDiv = document.querySelector(".header-right .default")
    loginDiv.classList.add('hide')
    const adminEmailDiv = document.querySelector('.icons.dropdown')
    const adminEmailText = document.querySelector('.icons.dropdown .user-email')
    adminEmailDiv.classList.remove('hide')
    adminEmailText.innerText = data.admin.email
}

function renderNumberProduct(data) {
    var countNumber = 0
    const date = new Date()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    for (order of data.orders) {
        const time = order.createdAt.split('-')
        const [checkYear, checkMonth] = time
        if (month === Number(checkMonth)) {
            for (product of JSON.parse(order.detail)) {
                countNumber += Number(product.number)
            }
        }
    }
    const productSold = document.querySelector("#products-sold")
    productSold.innerHTML =
        `<h3 class="card-title text-white">Products Sold</h3>
    <div class="d-inline-block">
        <h2 class="text-white">${countNumber}</h2>
        <p class="text-white mb-0">${monthNames[month - 1]}- ${year}</p>
    </div>
    <span class="float-right display-5 opacity-5"><i class="fa fa-shopping-cart"></i></span>`
}

function renderNetProfit(data) {
    var countNumber = 0
    const date = new Date()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    for (order of data.orders) {
        const time = order.createdAt.split('-')
        const [checkYear, checkMonth] = time
        if (month === Number(checkMonth)) {
            var price = []
            for (var i of order.price.split('')) {
                if (i != "đ" && i != ",") {
                    price.push(i)
                }
            }
            countNumber += Number(price.join(''))
        }
    }
    countNumber = (Math.floor(countNumber / 23000))
    const productSold = document.querySelector("#net-profit")
    productSold.innerHTML =
        `<h3 class="card-title text-white">Net Profit</h3>
    <div class="d-inline-block">
        <h2 class="text-white">$ ${countNumber}</h2>
        <p class="text-white mb-0">${monthNames[month - 1]}- ${year}</p>
    </div>
    <span class="float-right display-5 opacity-5"><i class="fa fa-money"></i></span>`
}