$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "http://localhost:3333/api/item/show",
    dataType: "json",
    success: function (data) {
      if(data.status){
        renderItems(data.items)
      }
    }
  });
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
    $(".items").click(function (e) { 
      e.preventDefault();
      if(e.target.matches(".btn__buy")){
        alert("bạn cần đăng nhập")
      }
    });
    
  }





  //------------render--------------
  function renderItems(items){
    let htmls = ''
    var itemsDiv = document.querySelector(".items")
    for (var i of items){
      htmls += `
      <div class="card" style="width: 18rem;">
        <div class="card-body">
          <p hidden class= "idOfItem">${i.id} </p>
          <h5 class="name-product">${i.name}</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the
              card's content.</p>
          <p class="price-product">${i.price}</p>
          <a href="#" class="btn btn-primary btn__buy">BUY</a>
        </div>
      </div>`
    }
    itemsDiv.innerHTML = htmls
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
    console.log(1)
      e.preventDefault();
      const parentDiv = e.target.parentElement
      const nameProduct = parentDiv.querySelector(".name-product").innerText
      const priceProduct = parentDiv.querySelector(".price-product").innerText
      const idOfItem = parentDiv.querySelector(".idOfItem").innerText
      console.log(1)
      $.ajax({
          type: "POST",
          url: "http://localhost:3333/api/cart/create",
          data: {
              "user_id": data.user.id,
              "item_id": Number(idOfItem),
              "name": `${nameProduct}`,
              "price": `${priceProduct}`,
          },
          dataType: "json",
          success: function (response) {
              console.log('success')
              window.open('/client/page/cart.html')
          }
      });
      window.open('/client/page/cart.html')
  });
}

