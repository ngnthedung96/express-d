import { payDb } from '../dbs/index.mjs'
import { cartDb } from '../dbs/index.mjs'
import { itemsDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import { request } from 'http';
import { stringify } from 'querystring';
import { JSONB } from 'sequelize';


const createOrder = async (req, res, next) => {
  var { user_id, note, price, date, time, detail } = req.body;
  var details = []

  for (var i of detail) {
    details.push(JSON.stringify(i))
  }
  try {
    if (!note) {
      note = " "
    }
    const order = await payDb.createOrder(user_id, note, price, date, time, details)
    for (var i of detail) {
      const item = await itemsDb.findItem(i.item_id)
      await item.update({
        number: item.dataValues.number - Number(i.number),
      })
      await item.save()
    }
    await cartDb.deleteAll()
    res.json({
      status: "success",
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
        orders
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}




export const payController = {
  createOrder,
  showOrders,
  showAllOrders
}