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
  setTimeout(function () {
    catNavSection.classList.remove('open')
  }, 200)
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

//-------------------------API--------------------------------


$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "http://localhost:3333/api/item/show",
    dataType: "json",
    success: function (data) {
      if (data.status) {
        renderItems(data.items)
        if (localStorage.getItem("accessToken")) {
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
                logOut()
                haveUserLogin(data)
                postProductTocart(data)
                viewItem(data)
              }
            })
        }
        else {
          $(".oustanding-product").click(function (e) {
            e.preventDefault();
            if (e.target.closest(".addToCart")) {
              errorFunction("Bạn cần đăng nhập")
            }
          });
          $(".products-content__product").click(function (e) {
            e.preventDefault();
            if (e.target.closest(".addToCart")) {
              errorFunction("Bạn cần đăng nhập")
            }
          });
          $(".oustanding-product").click(function (e) {
            e.preventDefault();
            if (e.target.closest(".viewProduct")) {
              errorFunction("Bạn cần đăng nhập")
            }
          });
          $(".products-content__product").click(function (e) {
            e.preventDefault();
            if (e.target.closest(".viewProduct")) {
              errorFunction("Bạn cần đăng nhập")
            }
          });
        }
      }
    }
  });
});


//------------render--------------
function renderItems(items) {
  //------------------------outstanding------------------------------
  const outstandingProducts = document.querySelectorAll(".oustanding-product")
  for (var i = 0; i < items.length; i++) {
    for (var j = 0; j < outstandingProducts.length; j++) {
      const item = items[i]
      const imgOfItem = (JSON.parse(item.img)[0])
      const outstandingProductDiv = outstandingProducts[j]
      var htmls = ''
      if (i === j) {
        htmls += `
                  <a>
                      <p class="id hide">${item.id}</p>
                      <img class= "img" src="${imgOfItem}"
                          alt="">
                      <h4 class = "name"> ${item.name}</h4>
                      <p class="price">${item.price}</p>
                  </a>
                  <div class="hoverProduct">
                      <a href="" class="addToCart">
                          <i class="fa-solid fa-cart-plus"></i>
                      </a>
                      <a href="" class="viewProduct"  data-set = "${item.id}">
                          <i class="fa-solid fa-eye"></i>
                      </a>
                  </div>`
        outstandingProductDiv.innerHTML = htmls
      }
    }
  }



  //-----------------------------------products-----------------------------
  const products = document.querySelectorAll(".js-products-content__item .products-content__product")
  for (var i = 0; i < items.length; i++) {
    for (var j = 0; j < products.length; j++) {
      const item = items[i]
      const imgOfItem = (JSON.parse(item.img)[0])
      const productDiv = products[j]
      var htmls = ''
      if (i === j) {
        htmls += `
        <p class="id hide">${item.id}</p>
        <img class = "img" src="${imgOfItem}"
            alt="">
        <h4 class="name">${item.name}</h4>
        <p class="price">${item.price}</p>
        <div class="hoverProduct">
          <a href="" class="addToCart">
            <i class="fa-solid fa-cart-plus"></i>
          </a>
          <a href="" class="viewProduct" data-set= "${item.id}">
            <i class="fa-solid fa-eye"></i>
          </a>
        </div>`
        productDiv.innerHTML = htmls
      }
    }
  }
}

function viewItem(items) {
  $(".hoverProduct").click(function (e) {
    if (e.target.closest('.viewProduct')) {
      const idItem = (this.querySelector(".viewProduct").getAttribute("data-set"))
      window.open(`./page/product.html?id=${idItem}`)
    }
  });
}


function haveUserLogin(data) {
  const user = document.querySelector('.header-nav .user-logout-nav')
  const signIn = document.querySelector('.header-nav .login-register-nav')
  signIn.classList.toggle('hide')
  user.classList.toggle('hide')
  const name = user.querySelector('.user-name span')
  name.innerText = `${data.user.email}`
}

function logOut() {
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
        successFunction(data)
        setTimeout(function () {
          location.reload()
        }, 1000)
      })
  });
}

function postProductTocart(data) {
  $(".addToCart").click(function (e) {
    console.log(1)
    e.preventDefault();
    var parentDiv = this.parentElement.parentElement
    const nameItem = parentDiv.querySelector(".name").innerText
    var priceItem = parentDiv.querySelector(".price").innerText
    const idOfItem = parentDiv.querySelector(".id").innerText
    const imgOfItem = parentDiv.querySelector(".img").getAttribute("src")
    $.ajax({
      type: "POST",
      url: "http://localhost:3333/api/cart/create",
      data: {
        "user_id": data.user.id,
        "item_id": Number(idOfItem),
        "name": `${nameItem}`,
        "price": `${priceItem}`,
        "img": `${imgOfItem}`,
      },
      dataType: "json",
      success: function (data) {
        successFunction(data)
        setTimeout(function () {
          window.open('/client/page/cart.html')
        }, 1000)
      }
    });
    setTimeout(function () {
      window.open('/client/page/cart.html')
    }, 1500)
  });
}




// ------toast---------------
import toast from "./toast.js"
function successFunction(data) {
  if (data.status) {
    toast({
      title: 'Success',
      message: `${data.msg}`,
      type: 'success'
    })
    setTimeout(function () {
      window.close()
      window.open('/client/index.html')
    }, 1500)
    // setTimeout(function () {
    //     location.reload()
    // }, 2000)
  }
}
function errorFunction(message) {
  toast({
    title: 'Error',
    message: `${message}`,
    type: 'error'
  })
}
