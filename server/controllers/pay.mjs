import { payDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';


const createOrder = async(req, res, next) => {
  const { user_id,item_id, name, price ,number} = req.body;
  try {
      const order = await payDb.createOrder(user_id,item_id, name, price ,number)
      res.json({
        status: "success",
        order
      })
  } catch (e) {
      console.log(e.message)
      res.sendStatus(500) && next(e)
  }
}

export const payController = {
    createOrder
  }