import * as XLSX from './node_modules/xlsx/xlsx.mjs'
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/admins/showorder",
        dataType: "json",
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessAdminToken"),
        },
        success: function (data) {
            renderOrders(data)
            haveAdminLogin(data)
            showDetail(data)
        }
    });
});

function renderOrders(data) {
    let myData = [];
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
        <td> <p class = "detail">Chi tiết</p> 
        </td>
        <td class="dateReceive">${dateReceive}</td>
        `
        const product = tableRow.querySelector('.products-col')
        for (var j of JSON.parse(detail)) {
            var priceOfProduct = []
            for (var i of j.price.split('')) {
                if (i != "đ" && i != ",") {
                    priceOfProduct.push(i)
                }
            }
            $.ajax({
                async: false,
                type: "GET",
                url: `http://localhost:3333/api/item/showitem/${j.item_id}`,
                dataType: "json",
                success: function (data) {
                    const item = data.item
                    if (item) {
                        const productDiv = document.createElement('div')
                        productDiv.classList.add('product')
                        productDiv.innerHTML = `
                    <img class = "img" src=${JSON.parse(item.img)[0]}
                        alt="">
                    <p class = "name">${item.name}</p>
                    <p class = "price" hidden >${item.price}</p>
                    <p class = "imPrice" hidden >${item.imPrice}</p>
                    <p class = "number" hidden >${j.number}</p>
                `
                        product.appendChild(productDiv)
                    }
                }
            });
        }
        myData.push({
            "user": userEmail,
            "orderingDate": dateCreate,
            "price": totalPrice,
            "receivingDate": dateReceive

        })
        tableBody.appendChild(tableRow)
        countTable++
    }
    exportToExcel("Orders", "Orders", "Orders", myData)
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


function exportToExcel(fileName, sheetName, table, myData) {
    $(".excel").click(function (e) {
        if (myData.length === 0) {
            console.error('Chưa có data');
            return;
        }
        console.log('exportToExcel', myData);
        let wb;
        const ws = XLSX.utils.json_to_sheet(myData);
        // console.log('ws', ws);
        var max_width = myData.reduce((w, r) => Math.max(w, r.orderingDate.length, r.user.length, r.price.length, r.receivingDate.length), 10);
        ws["!cols"] = [{ wch: max_width }]
        for (var i in ws) {
            if (typeof (ws[i]) != "object") continue;
            let cell = XLSX.utils.encode_cell(i);
            ws[i].s = { // styling for all cells
                font: {
                    name: "arial"
                },
                alignment: {
                    vertical: "center",
                    horizontal: "center",
                    wrapText: '1', // any truthy value here
                },
                border: {
                    right: {
                        style: "thin",
                        color: "000000"
                    },
                    left: {
                        style: "thin",
                        color: "000000"
                    },
                }
            };

            if (cell.c == 0) { // first column
                ws[i].s.numFmt = "DD/MM/YYYY HH:MM"; // for dates
                ws[i].z = "DD/MM/YYYY HH:MM";
            } else {
                ws[i].s.numFmt = "00.00"; // other numbers
            }

            if (cell.r == 0) { // first row
                ws[i].s.border.bottom = { // bottom border
                    style: "thin",
                    color: "000000"
                };
            }

            if (cell.r % 2) { // every other row
                ws[i].s.fill = { // background color
                    patternType: "solid",
                    fgColor: { rgb: "b2b2b2" },
                    bgColor: { rgb: "b2b2b2" }
                };
            }
        }

        wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.utils.sheet_add_aoa(ws, [["Khách Hàng", "Ngày Đặt", "Tổng Tiền", "Ngày Nhận"]], { origin: "A1" });
        console.log(ws)
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' }); //workbook output
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `${fileName}.xlsx`) // save workbook
        e.preventDefault();
    });
}


function showDetail(data) {
    const tableDetailSection = document.querySelector(".modal-detail-section ")
    const tableDetailContent = document.querySelector(".modal-detail-section .modal-detail-content ")
    $(".table-orders").click(function (e) {
        let parentEl = null
        e.preventDefault();
        if (e.target.closest(".detail")) {
            tableDetailSection.classList.add('open')
            parentEl = getParent(e.target, "tr")
        }
        renderDetail(parentEl)
    });
    tableDetailSection.addEventListener("click", e => {
        tableDetailSection.classList.remove('open')
    })
    tableDetailContent.addEventListener("click", e => {
        e.stopPropagation()
    })
}

function renderDetail(element) {
    if (element) {
        const fee = 10
        const tbodyModalDiv = document.querySelector(".modal-detail-content tbody")
        tbodyModalDiv.innerHTML = ''
        const price = element.querySelectorAll(".price")
        const number = element.querySelectorAll(".number")

        const imPrice = element.querySelectorAll(".imPrice")
        const totalPrice = element.querySelector(".total-price")
        const name = element.querySelectorAll(".name")
        var count = 0
        for (var i = 0; i < name.length; i++) {
            var priceOfProduct = handlePrice(price[i].innerText)
            let priceOfOder = priceOfProduct * Number(number[i].innerText)
            count++
            const trOfModal = document.createElement('tr')
            trOfModal.innerHTML = `
            <td class = "count">${count}</td>
            <td class = "name">${name[i].innerText}</td>
            <td class = "imPrice">${imPrice[i].innerText}</td>
            <td class = "price">${price[i].innerText}</td>
            <td class = "number">${number[i].innerText}</td>
            <td class = "total-price-product">${priceOfOder}</td>
            `
            tbodyModalDiv.appendChild(trOfModal)
        }
        const feeDiv = document.querySelector(".footer-modal .fee .price")
        const shipDiv = document.querySelector(".footer-modal .ship .price")
        const totalPriceDiv = document.querySelector(".footer-modal .total-price .price")
        const totalProfitDiv = document.querySelector(".footer-modal .total-profit .price")
        feeDiv.innerText = handleTotalPrice(Math.round(handlePrice(totalPrice.innerText) * fee / 100))
        shipDiv.innerText = '30,000đ'
        totalPriceDiv.innerText = totalPrice.innerText
        totalProfitDiv.innerText = handleTotalPrice(handlePrice(totalPrice.innerText) - handlePrice(feeDiv.innerText) - handlePrice(shipDiv.innerText))
    }
}

function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement
        }
        element = element.parentElement
    }
}

function handlePrice(price) {
    var priceOfProduct = []
    for (var j of price.split('')) {
        if (j != "đ" && j != ",") {
            priceOfProduct.push(j)
        }
    }
    return Number(priceOfProduct.join(''))
}

function handleTotalPrice(price) {
    var container = `${price}`.split('').reverse()
    var b = []
    var count = 0
    for (var i of container) {
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
        b = (b.slice(1, b.length)).join('') + 'đ'
    }
    else {
        b = b.join('') + 'đ'
    }

    return b
}