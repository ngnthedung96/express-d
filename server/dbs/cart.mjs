import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'
const Cart = sequelize.define('Cart', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {});
const createProduct = async(user_id,item_id,name,price)=>{
    console.log(user_id,
        item_id,
        name,
        price)
    let res = null;
    try{
        res = await Cart.create({
            user_id: user_id,
            item_id: item_id,
            name: name,
            price: price
        }, { fields: ['user_id',"item_id", 'name','price'] })
    } catch (err) {
        logger.error(err)
    }
    console.log(res)
    return res;
}
const findProducts = async (value, field) => {
  let res = null;
  try {
      res = await Cart.findAll(
        {
            where: { "user_id": value },
        }
    )
  }
  catch(err) {
      logger.error(err)
  }
  return res;
}
const findAllProducts = async (value, field) => {
    let res = null;
    try {
        res = await Cart.findAll(
      )
    }
    catch(err) {
        logger.error(err)
    }
    return res;
  }

const findProduct = async (value, field) => {
    let res = null;
    try {
        res = await Cart.findOne(
          {
              where: { "id": value },
          }
      )
    }
    catch(err) {
        logger.error(err)
    }
    return res;
}

const findProductById = async (value, field) => {
    let res = null;
    try {
        res = await Cart.findOne(
          {
              where: { "item_id": value },
          }
      )
    }
    catch(err) {
        logger.error(err)
    }
    return res;
  }



  const deleteProduct = async (value, field) => {
    let res = null;
    try {
        res = await Cart.destroy(
          {
              where: { "id": value },
          }
      )
    }
    catch(err) {
        logger.error(err)
    }
    return res;
  }


  
  const deleteAll= async () => {
    let res = null;
    try {
        res = await Cart.destroy({
            truncate: true
        }
            
      )
    }
    catch(err) {
        logger.error(err)
    }
    return res;
  }
export const cartDb = {
    createProduct,
    findProducts,
    findProduct,
    deleteProduct,
    findProductById,
    findAllProducts,
    deleteAll
}