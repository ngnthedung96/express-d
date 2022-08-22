import { codeDb, payDb, saleDb } from '../dbs/index.mjs'
import { cartDb } from '../dbs/index.mjs'
import { itemsDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import { request } from 'http';
import { stringify } from 'querystring';
import { JSONB } from 'sequelize';


const createOrder = async (req, res, next) => {
  var { user_id, note, shipFee, oldPrice, price, code, date, time, detail } = req.body;
  var rate = " "
  var staffFee = handlePriceToshow(Math.round(handlePriceToCal(oldPrice) * 10 / 100))
  var checkCode = "false"
  var details = []

  for (var i of detail) {
    details.push(JSON.stringify(i))
  }
  try {
    if (!note) {
      note = " "
    }
    else if (!code) {
      code = " "
    }

    // add code
    var ordersOfUser = await payDb.findOrders(user_id)
    var ordersContainer = null
    for (var i = 0; i < ordersOfUser.length; i++) {
      if (ordersOfUser[i].dataValues.checkCode === "checked") {
        ordersContainer = ordersOfUser.slice(i + 1, ordersOfUser.length)
      }
    }
    if (ordersContainer) {
      var count = 0
      for (var orderBlock of ordersContainer) {
        for (var numberOrder of JSON.parse(orderBlock.detail)) {
          for (var numberProduct of numberOrder.number) {
            count += Number(numberProduct)
          }
        }
      }
      if (count >= 4) {
        await saleDb.createSale("GIAM10", user_id)
        checkCode = 'checked'
      }
    }
    else {
      var count = 0
      if (ordersOfUser.length <= 1) {
        for (var numberOfProduct of detail) {
          count += numberOfProduct.number
        }
      }
      else {
        for (var orderBlock of ordersOfUser) {
          if (orderBlock.checkCode === "checked") {
            break
          }
          else {
            for (var numberOrder of JSON.parse(orderBlock.detail)) {
              for (var numberProduct of numberOrder.number) {
                // console.log(numberProduct)
                count += Number(numberProduct)
              }
            }
          }
        }
      }
      if (count >= 4) {
        await saleDb.createSale("GIAM10", user_id)
        checkCode = 'checked'
      }
    }

    // add order
    const order = await payDb.createOrder(user_id, note, price, code, date, time, checkCode, shipFee, staffFee, rate, details)
    for (var i of detail) {
      const item = await itemsDb.findItem(i.item_id)
      await item.update({
        number: item.dataValues.number - Number(i.number),
      })
      await item.save()
      await saleDb.deleteSale(code)
      // // delete cart
      await cartDb.deleteAll()
    }
    res.json({
      status: "Success",
      msg: "Thanh toán thành công",
      order
    })
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}


const showOrders = async (req, res, next) => {
  try {
    if (req.user) {
      const orders = await payDb.findOrders(req.user.id, 'user_id')
      res.json({
        status: true,
        orders
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}
const showAllOrders = async (req, res, next) => {
  try {
    if (req.user) {
      const orders = await payDb.findAllOrders()
      res.json({
        status: true,
        orders,
        id: req.user.id
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}

function handlePriceToshow(price) {
  var container = `${price}`.split('').reverse()
  var b = []
  var count = 0
  for (var i of container) {
    count++
    if (count === 3) {
      count = 0
      b.push(i)
      b.push(',')
    }
    else {
      b.push(i)
    }
  }
  if (b.reverse()[0] === ',') {
    b = (b.slice(1, b.length)).join('') + 'đ'
  }
  else {
    b = b.join('') + 'đ'
  }
  return b
}

function handlePriceToCal(price) {
  var container = []
  for (var j of price.split('')) {
    if (j != "đ" && j != ",") {
      container.push(j)
    }
  }
  return Number(container.join(''))
}





export const payController = {
  createOrder,
  showOrders,
  showAllOrders
}