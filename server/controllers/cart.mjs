import { cartDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';


const createProduct = async (req, res, next) => {
  const { user_id, item_id, name, price, img } = req.body;
  try {
    const check = await cartDb.findProductById(item_id);
    if (!check) {
      const product = await cartDb.createProduct(user_id, item_id, name, price, img);
      res.status(200).json({
        status: true,
        msg: 'Chọn sản phẩm thành công',
        data: {
          pid: product.id,
          user_id: user_id,
          product_id: item_id,
          name: name,
          price: price,
        }
      });
      next()
    }
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}

const showProducts = async (req, res, next) => {
  try {
    if (req.user) {
      const products = await cartDb.findProducts(req.user.id, 'user_id')
      res.json({
        status: true,
        products: products
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}

const deleteProduct = async (req, res, next) => {
  const { id } = req.body;

  try {
    const product = await cartDb.deleteProduct(id);
    res.status(200).json({
      status: true,
      msg: 'Xóa sản phẩm thành công',
    });

    next()
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}

export const cartController = {
  createProduct,
  showProducts,
  deleteProduct
}