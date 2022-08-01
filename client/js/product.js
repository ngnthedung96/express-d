//----------------img effect-----------------------
const subImg = document.querySelectorAll('.left .sub-img img')
const mainImg = document.querySelector('.left .main-img img')

const sliderEffect = {
  currentIndex: 0,
  render() {
    var a = document.querySelector('.left .sub-img img.borderSlider')
    if (a) {
      a.classList.remove('borderSlider')
    }
    subImg[this.currentIndex].classList.add('borderSlider')
    setTimeout(() => {
      mainImg.attributes.src.value = subImg[this.currentIndex].attributes.src.value
    }, 200)
  },
  clickImg() {
    var __this = this
    subImg.forEach(function (item, index) {
      item.addEventListener('click', function () {
        __this.currentIndex = (item.getAttribute('data-set'))
        __this.render()
      })
    })
  },
  start: function () {
    this.render()
    this.clickImg()
  }
}
sliderEffect.start()








$(document).ready(function () {
  $(".prev").click(function (e) {
    e.preventDefault();
    const priceDiv = document.querySelector('.price').innerText
    var price = []
    for (i of priceDiv.split('')) {
      if (i != "đ" && i != ",") {
        price.push(i)
      }
    }
    const parentElement = e.target.parentElement
    const inputNumber = parentElement.querySelector('.number')
    var valueOfInput = inputNumber.value
    if (valueOfInput != 1) {
      inputNumber.value = valueOfInput - 1
    }
    console.log(Number(price.join('')) * Number(inputNumber.value))
  });
  $(".next").click(function (e) {
    e.preventDefault();
    const priceDiv = document.querySelector('.price').innerText
    var price = []
    for (i of priceDiv.split('')) {
      if (i != "đ" && i != ",") {
        price.push(i)
      }
    }
    const parentElement = e.target.parentElement
    const inputNumber = parentElement.querySelector('.number')
    var valueOfInput = inputNumber.value
    inputNumber.value = Number(valueOfInput) + 1
    console.log(Number(price.join('')) * Number(inputNumber.value))
  });
  const number = document.querySelector('.number')
  number.addEventListener('input', function () {
    const priceDiv = document.querySelector('.price').innerText
    var price = []
    for (i of priceDiv.split('')) {
      if (i != "đ" && i != ",") {
        price.push(i)
      }
    }
    if (number.value) {
      console.log(Number(price.join('')) * Number(number.value))
    }
  })

  //default
  const priceDiv = document.querySelector('.price').innerText
  var price = []
  for (i of priceDiv.split('')) {
    if (i != "đ" && i != ",") {
      price.push(i)
    }
  }
  console.log(Number(price.join('')) * Number(number.value))
});


// -------------------slide-down---------------------

$(document).ready(function () {
  $('.inforOfProduct .inforOfProduct-header').click(function (e) {
    e.preventDefault();
    $(".text").slideToggle();
    $('body').animate({
      scrollTop: $(this).offset().top
    })
    $('.inforOfProduct .btn-slide').toggleClass('btnSlideActive');
  });
  $('.guide .guide-header').click(function (e) {
    e.preventDefault();
    $(".guide  img").slideToggle();
    $('body').animate({
      scrollTop: $(this).offset().top
    })
    $('.guide .btn-slide').toggleClass('btnSlideActive');
  });
});

