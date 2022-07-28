$(document).ready(function () {
  $.ajax({
      type: "GET",
      url: "http://localhost:3333/api/cart/show",
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
        url: "http://localhost:3333/api/cart/delete",
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

  
  $(".btn-pay").click(function (e) { 
    e.preventDefault();
    var numberValues = document.querySelectorAll(".number")
    var check = []
    for (var i of numberValues){
      if (i.value==0){
        check = []
        check.push(false)
      }
      else{
        check = []
        check.push(true)
      }
    }
    if(!check[0]){
      alert('nhập số lượng')
    }
    else{
      const orders = document.querySelectorAll("tbody tr")
      const container = []
      for (i of orders){
        const user_id = i.querySelector(".id-user").innerText 
        const item_id = i.querySelector(".id-item").innerText 
        const name = i.querySelector(".name").innerText 
        const price = i.querySelector(".price").innerText 
        const number = i.querySelector(".number").value
        const block = {
          user_id,
          item_id,
          name,
          price,
          number
        }
        container.push(block)
      }
      console.log(container)
    }
    
     
    

  });



});

function renderProducts(data) {
  const row = document.querySelector("table tbody")
  const first =  `<tr>
  <th></th>
  <th>Chưa có sản phẩm</th>
  <th></th>
  <th></th>
  <th></th>
</tr>`
  var htmls = ''
  var count = 1
  for (var i of data.products) {
    console.log(i)
      htmls += `
      <tr>
                  <th hidden ><p class="id-product">${i.id} </p></th>
                  <th hidden ><p class="id-user">${i.user_id} </p></th>
                  <th hidden ><p class="id-item">${i.item_id} </p></th>
                  <th>${count}</th>
                  <th class = "name">${i.name}</th>
                  <th class = "price">${i.price}</th>
                  <th>
                    <input class ="number" type="number" id="quantity" name="quantity" min="1">
                  </th>
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