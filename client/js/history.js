$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:3333/api/pay/show",
        dataType: 'json',
        headers: {
            token: 'Bearer ' + localStorage.getItem("accessToken"),
        },
        success: function (data) {
            console.log(JSON.parse(data.orders[0].detail))
        }
    });
});