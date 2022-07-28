import { productsDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';


const createProduct = async(req, res, next) => {
  const { user_id,name, price } = req.body;

  try {
      const product = await productsDb.createProduct( user_id,name, price);
      res.status(200).json({
          status: true,
          msg: 'Chọn sản phẩm thành công',
          data: {
              pid: product.id,
              user_id: user_id,
              name: name,
              price: price,
          }
      });

      next()
  } catch (e) {
      console.log(e.message)
      res.sendStatus(500) && next(e)
  }
}

const showProducts =  async (req, res, next) =>{
  try {
    if(req.user){
        const products = await productsDb.findProducts(req.user.id, 'user_id')
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

const deleteProduct = async(req, res, next) => {
  const { id } = req.body;

  try {
      const product = await productsDb.deleteProduct( id);
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

export const productsController = {
  createProduct,
  showProducts,
  deleteProduct
}