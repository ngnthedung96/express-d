$(document).ready(function () {
  $.ajax({
      type: "GET",
      url: "http://localhost:3333/api/product/show",
      dataType: "json",
      headers: {
        token: 'Bearer ' + localStorage.getItem("accessToken"),
      },
      success: function (data) {
          if (data.status) {
              renderProducts(data)
          }
      }
  });
});
  $("table").click(function (e) { 
    e.preventDefault();
    var btnDelete =e.target.matches(".btn-delete")
    if(btnDelete) {
      var parentEl
      var element = e.target.parentElement
      while(element){
        if (element.matches('tr')){
          parentEl = element
          break
        }
        element = element.parentElement
      }
      const id = Number(parentEl.querySelector('.id-product').innerText)
      $.ajax({
        type: "POST",
        url: "http://localhost:3333/api/product/delete",
        data: {
          "id": id
        },
        dataType: "json",
        success: function (response) {
          alert("xóa sản phẩm thành công")
          location.reload()
        }
      });
    }
  });
function renderProducts(data) {
  const row = document.querySelector("table tbody")
  const first =  `<tr>
  <th></th>
  <th>Chưa có sản phẩm</th>
  <th></th>
  <th></th>
</tr>`
  var htmls = ''
  var count = 1
  for (var i of data.products) {
      htmls += `
      <tr>
                  <th hidden ><p class="id-product">${i.id} </p></th>
                  <th>${count}</th>
                  <th>${i.name}</th>
                  <th>${i.price}</th>
                  <th><button type="button" class="btn btn-danger btn-delete">Xóa</button></th>
                  
      </tr>
      
      `
      count++
  }
  if(htmls.length>1){
    row.innerHTML = htmls
  }
  else{
    row.innerHTML =first
  }
}