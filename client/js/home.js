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
          }

      })
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
  user.classList.toggle('hide')
  const name = user.querySelector('a')
  name.innerText = `${data.user.email}`
}



