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

const showItemsToken = async (req, res, next) => {
  try {
    if (req.user) {
      const items = await itemsDb.findItems()
      res.json({
        status: true,
        items: items,
        id: req.user.id
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}

const showItem = async (req, res, next) => {
  try {
    const items = await itemsDb.findItem(req.params.id)
    res.json({
      status: true,
      item: items,
      user_id: req.user.id
    })
  }
  catch (err) {
    console.log(err)
  }
}

const createItem = async (req, res, next) => {
  const { name, price, img } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  try {
    var imgs = []
    for (var i of img) {
      imgs.push(JSON.stringify(i))
    }
    if (req.user) {
      const product = await itemsDb.createItem(name, price, imgs);
      res.status(200).json({
        status: true,
        msg: 'Thêm sản phẩm thành công',
        data: {
          pid: product.id,
          name: name,
          price: price,
          adminId: req.user.id,
          img
        }
      });
      next()
    }
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}
export const itemsController = {
  showItems,
  showItem,
  showItemsToken,
  createItem
}