$(document).ready(function () {
    $('.form-submit').click(function (e) {
        e.preventDefault()
        const email = document.querySelector("#email")
        const password = document.querySelector("#password")
        if (email.value && password.value) {
            $.ajax({
                url: 'http://localhost:3333/api/users/login',
                dataType: 'json',
                type: "POST",
                data: {
                    "email": `${email.value}`,
                    "password": `${password.value}`,
                }

            })
                .done(function (data, textStatus, jqXHR) {
                   successFunction(data)
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    errorFunction(jqXHR, textStatus, errorThrown)

                })
        }
    });
});
// ------toast---------------
import toast from "./toast.js"
function successFunction(data) {
    if (data.status) {
        toast({
            title: 'Success',
            message: 'Đăng nhập tài khoản thành công',
            type: 'success'
        })
        // setTimeout(function () {
        //     location.reload()
        // }, 2000)
    }
    else {
        toast({
            title: 'Error',
            message: 'Sai tên tài khoản hoặc mật khẩu',
            type: 'error'
        })
    }
}
function errorFunction(jqXHR, textStatus, errorThrown) {
    toast({
        title: 'Error',
        message: 'Xảy ra lỗi ' + textStatus + errorThrown,
        type: 'error'
    })
}
