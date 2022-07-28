$(document).ready(function () {
  if(localStorage.getItem("accessToken")){
    $.ajax({
      url: "http://localhost:3333/api/users/home",
      type: "GET",
      dataType: 'json',
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessToken"),
      }
  })
      .done(function (data, textStatus, jqXHR) {
          if (data.status) {
            haveUserLogin(data)
            postProductTocart(data)
          }
      })
  }
  else{
    $(".btn__buy").click(function (e) { 
      e.preventDefault();
      alert("bạn cần đăng nhập")
    });
    
  }
  //-------log out--------------
  $('.log-out__btn').click(function (e) { 
    e.preventDefault();
    $.ajax({
      url: "http://localhost:3333/api/users/logout",
      type: "POST",
      dataType: 'json',
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessToken"),
      }
  })
      .done(function (data, textStatus, jqXHR) {
          localStorage.removeItem('accessToken');
          alert(data.msg)
          location.reload()
      })
  });
});



function haveUserLogin(data) {
  const user = document.querySelector('.nav-item.dropdown')
  const signIn = document.querySelector('.sign-in__btn')
  const signUp = document.querySelector('.sign-up__btn')
  signIn.classList.toggle('hide')
  signUp.classList.toggle('hide')
  user.classList.toggle('hide')
  const name = user.querySelector('a')
  name.innerText = `${data.user.email}`
}

function postProductTocart(data) {
  $(".btn__buy").click(function (e) {
      e.preventDefault();
      const parentDiv = e.target.parentElement
      const nameProduct = parentDiv.querySelector(".name-product").innerText
      const priceProduct = parentDiv.querySelector(".price-product").innerText
      $.ajax({
          type: "POST",
          url: "http://localhost:3333/api/product/create",
          data: {
              "user_id": data.user.id,
              "name": `${nameProduct}`,
              "price": `${priceProduct}`,
          },
          dataType: "json",
          success: function (response) {
              console.log('success')
              window.open('/client/page/cart.html')
          }
      });
  });
}

