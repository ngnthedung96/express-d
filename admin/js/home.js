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
                getNumberProductMax(data)
            }
        });
        $.ajax({
            type: "GET",
            url: "http://localhost:3333/api/admins/showusers",
            headers: {
                token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
            },
            success: function (data) {
                renderNewCustomers(data)
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
    const totalEarningMonth = document.querySelector(".product-sales .total-earning-month")
    totalEarningMonth.innerText = `$ ${countNumber}`
    const netProfit = document.querySelector("#net-profit")
    netProfit.innerHTML =
        `<h3 class="card-title text-white">Net Profit</h3>
    <div class="d-inline-block">
        <h2 class="text-white">$ ${countNumber}</h2>
        <p class="text-white mb-0">${monthNames[month - 1]}- ${year}</p>
    </div>
    <span class="float-right display-5 opacity-5"><i class="fa fa-money"></i></span>`
}

function renderNewCustomers(data) {
    var countNumber = 0
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    for (user of data.user) {
        const time = user.createdAt.split('-')
        const [checkYear, checkMonth] = time
        if (month === Number(checkMonth)) {
            countNumber++
        }
        const newCustomer = document.querySelector("#new-customers")
        newCustomer.innerHTML =
            `<h3 class="card-title text-white">New Customers</h3>
        <div class="d-inline-block">
            <h2 class="text-white">${countNumber}</h2>
            <p class="text-white mb-0">${monthNames[month - 1]}- ${year}</p>
        </div>
        <span class="float-right display-5 opacity-5"><i class="fa fa-users"></i></span>`
    }
}

function getNumberProductMax(data) {
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/item/show",
        success: function (response) {
            const date = new Date()
            const month = date.getMonth() + 1
            const idItemContainer = []
            const numberContainer = []
            var countNumber = 0
            for (item of response.items) {
                idItemContainer.push(item.id)
                numberContainer.push([])
            }
            for (order of data.orders) {
                const time = order.createdAt.split('-')
                const [checkYear, checkMonth] = time
                if (month === Number(checkMonth)) {
                    for (product of JSON.parse(order.detail)) {
                        countNumber += Number(product.number)
                        for (var i = 0; i < idItemContainer.length; i++) {
                            if (idItemContainer[i] === Number(product.item_id)) {
                                numberContainer[i].push(Number(product.number))
                            }
                        }
                    }
                }
            }
            const max = getMaxAndSum(numberContainer)
            var idMax = 0
            var newNumberContainer = []
            for (var i = 0; i < numberContainer.length; i++) {
                if (numberContainer[i] === max) {
                    idMax = idItemContainer[i]
                    newNumberContainer = numberContainer.slice(i + 1, numberContainer.length)
                }
            }
            var idMax2 = 0
            const max2 = getMaxAndSum(newNumberContainer)

            for (var i = 0; i < numberContainer.length; i++) {
                if (numberContainer[i] === max2) {
                    idMax2 = idItemContainer[i]
                }
            }
            const max1Div = document.querySelector(".best-seller .max-1")
            const max2Div = document.querySelector(".best-seller .max-2")
            for (item of response.items) {
                if (item.id === idMax) {
                    max1Div.innerText = item.name
                }
                else if (item.id === idMax2) {
                    max2Div.innerText = item.name
                }
            }
            const percentMax1 = Math.round(max / countNumber * 100)
            const percentMax2 = Math.round(max2 / countNumber * 100)
            const max1Progress = document.querySelector(".best-seller .product-max-1 .progress-bar ")
            const max2Progress = document.querySelector(".best-seller .product-max-2 .progress-bar ")
            max1Progress.style.width = `${percentMax1}%`
            max2Progress.style.width = `${percentMax2}%`

        }
    });
}

function getMaxAndSum(list) {
    var max = 0
    for (var i = 0; i < list.length; i++) {
        sum = 0
        if (Array.isArray(list[i])) {
            for (number of list[i]) {
                sum += number
            }
            if (sum > max) {
                max = sum
            }
            list[i] = sum
        }
        else {
            if (max < list[i]) {
                max = list[i]
            }
        }
    }
    return max
}
