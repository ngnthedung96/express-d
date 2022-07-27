$(document).ready(function () {
  if(localStorage.getItem("accessToken")){
    var idUser  
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
            console.log(data)
            idUser = data.user.id
              haveUserLogin(data)
          }
      })
  }
  console.log(idUser)
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



