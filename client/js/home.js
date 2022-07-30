//--------------------- slider-----------------------------
const sliderImage = document.querySelectorAll('.slider-footer__img img')
const sliderContainer = document.querySelector('.slider-container')
const sliderBtnLeft = document.querySelector('.slider-nav-btn .btn-left')
const sliderBtnRight = document.querySelector('.slider-nav-btn .btn-right')


const sliderEffect = {
    currentIndex: 0,
    render() {
        var a = document.querySelector('.slider-footer__img img.borderSlider')
        if (a) {
            a.classList.remove('borderSlider')
        }
        sliderImage[this.currentIndex].classList.add('borderSlider')
        sliderContainer.style.opacity = '0'
        setTimeout(() => {
            sliderContainer.style.opacity = '1'
            sliderContainer.style.backgroundImage = `url('${sliderImage[this.currentIndex].attributes.src.value}')`
        }, 500)
    },
    clickImg() {
        var __this = this
        sliderImage.forEach(function (item, index) {
            item.addEventListener('click', function () {
                __this.currentIndex = (item.getAttribute('data-set'))
                __this.render()
            })
        })
    },
    nextImg() {
        var __this = this
        sliderBtnLeft.addEventListener('click', function () {
            if (__this.currentIndex == 0) {
                __this.currentIndex = sliderImage.length - 1
            }
            else {
                __this.currentIndex--
            }
            __this.render()

        })
        sliderBtnRight.addEventListener('click', function () {
            if (__this.currentIndex == sliderImage.length - 1) {
                __this.currentIndex = 0
            }
            else {
                __this.currentIndex++
            }
            __this.render()
        })
    },
    start: function () {
        this.render()
        this.clickImg()
        this.nextImg()
    }
}
sliderEffect.start()




// ----------------show catnav-------------------- (thanh bên phải)
const catNavBtn = document.querySelector('.js-category-nav__btn')
const catNavBtnBack = document.querySelector('.js-category-nav__back-btn')
const catNavSection = document.querySelector(".category-nav-section")
const catNavContent = document.querySelector(".js-category-nav")
function showCatNav() {
    catNavSection.classList.add('open')
    catNavContent.style.animation = ' ShowcatNav ease-in 0.2s forwards'
    console.log(catNavContent.style.animation)

}
function hideCatNav() {
    setTimeout(function(){
      catNavSection.classList.remove('open')
    },200)
    catNavContent.style.animation = ' HidecatNav ease 0.2s forwards'
}
catNavBtn.addEventListener('click', showCatNav)
catNavBtnBack.addEventListener('click', hideCatNav)
catNavSection.addEventListener('click', hideCatNav)
catNavContent.addEventListener('click', function (e) {
    e.stopPropagation()
})

// ------------------------show subcatnav-------------( trong thanh bên phải)
$(document).ready(function () {
    $('.js-category-nav__product-btn').click(function (e) {
        e.preventDefault();
        $(".category-sub-nav__products").slideToggle();
        $('body').animate({
            scrollTop: $(this).offset().top
        })
        $('.js-category-nav__product-btn').toggleClass('catSubNavActive');
    });
});
// --------------Show product------------------

var productHeaderNav = document.querySelectorAll('.products-header__nav a')
var productContentItems = document.querySelectorAll(".js-products-content__item")
productHeaderNav.forEach(function (btn, index) {
    btn.addEventListener('click', function () {
        var a = document.querySelector('.products-header__nav a.colorGreen')
        a.classList.remove('colorGreen')
        this.classList.add('colorGreen')
        var c = document.querySelector(".js-products-content__item.open")
        c.classList.remove('open')
        var b = productContentItems[index]
        b.classList.add('open')
    })
})




//-------------------------API--------------------------------


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
    $(".oustanding-product").click(function (e) { 
      e.preventDefault();
      if(e.target.matches(".addToCart")){
        alert("bạn cần đăng nhập")
      }
    });
    
  }





  //------------render--------------
  function renderItems(items){
    //------------------------outstanding------------------------------
    const outstandingProducts = document.querySelectorAll(".oustanding-product")
    for (var i = 0; i <items.length; i++){
      for (var j = 0; j <outstandingProducts.length; j++){
        const item = items[i]
        const outstandingProductDiv = outstandingProducts[j]
        var htmls = ''
        if (i === j){
          htmls += `
                    <a>
                        <img src="${item.img}"
                            alt="">
                        <h4> ${item.name}</h4>
                        <p class="price">${item.price}</p>
                    </a>
                    <div class="hoverProduct">
                        <a href="" class="addToCart">
                            <i class="fa-solid fa-cart-plus"></i>
                        </a>
                        <a href="" class="viewProduct">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                    </div>`
          outstandingProductDiv.innerHTML = htmls
        }
      }
    }



    //-----------------------------------products-----------------------------
    const products = document.querySelectorAll(".js-products-content__item .products-content__product")
    for (var i = 0; i <items.length; i++){
      for (var j = 0; j <products.length; j++){
        const item = items[i]
        const productDiv = products[j]
        var htmls = ''
        if (i === j){
          htmls += `
            <img class = "img" src="${item.img}"
                alt="">
            <h4 class="name">${item.name}</h4>
            <p class="price">${item.price}</p>
            <div class="hoverProduct">
              <a href="" class="addToCart">
                <i class="fa-solid fa-cart-plus"></i>
              </a>
              <a href="" class="viewProduct">
                <i class="fa-solid fa-eye"></i>
              </a>
            </div>`
          productDiv.innerHTML = htmls
        }
      }
    }
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
  const user = document.querySelector('.header-nav .user-logout-nav')
  const signIn = document.querySelector('.header-nav .login-register-nav')
  signIn.classList.toggle('hide')
  user.classList.toggle('hide')
  const name = user.querySelector('.user-name span')
  name.innerText = `${data.user.email}`
}

function postProductTocart(data) {
  $(".addToCart").click(function (e) {
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
              setTimeout(function(){
                window.open('/client/page/cart.html')
              },1000)
          }
      });
      setTimeout(function(){
        window.open('/client/page/cart.html')
      },1500)
  });
}

