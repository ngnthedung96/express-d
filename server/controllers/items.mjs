import { itemsDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';

const showItems = async (req, res, next) => {
  try {
    const items = await itemsDb.findItems()
    res.json({
      status: true,
      items: items
    })
  }
  catch (err) {
    console.log(err)
  }
}
const showItem = async (req, res, next) => {
  console.log(req.body.item_id)
  try {
    const items = await itemsDb.findItem(req.body.item_id)
    res.json({
      status: true,
      item: items
    })
  }
  catch (err) {
    console.log(err)
  }
}

export const itemsController = {
  showItems,
  showItem
}