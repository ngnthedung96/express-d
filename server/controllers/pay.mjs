import { payDb } from '../dbs/index.mjs'
import { cartDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import { request } from 'http';
import { stringify } from 'querystring';
import { JSONB } from 'sequelize';


const createOrder = async(req, res, next) => {
  const {user_id,detail} = req.body;
  console.log(req.body)
  var details = []
  
  for (var i of detail){
    details.push(JSON.stringify(i))
  }
  try {
      const order = await payDb.createOrder(user_id,details)
      await cartDb.deleteAll()
      res.json({
        status: "success",
        order
      })
  } catch (e) {
      console.log(e.message)
      res.sendStatus(500) && next(e)
  }
}


const showOrders=  async (req, res, next) =>{
  try {
    if(req.user){
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


export const payController = {
    createOrder,
    showOrders
  }