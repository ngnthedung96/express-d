import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'
const Products = sequelize.define('products', {
    user_id: {
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
const createProduct = async(user_id,name,price)=>{
    let res = null;
    try{
        res = await Products.create({
            user_id: user_id,
            name: name,
            price: price
        }, { fields: ['user_id', 'name','price'] });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findProducts = async (value, field) => {
  let res = null;
  try {
      res = await Products.findAll(
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

const findProduct = async (value, field) => {
    let res = null;
    try {
        res = await Products.findOne(
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


  const deleteProduct = async (value, field) => {
    let res = null;
    try {
        res = await Products.destroy(
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
export const productsDb = {
    createProduct,
    findProducts,
    findProduct,
    deleteProduct
}