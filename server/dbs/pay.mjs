import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'
const Pay= sequelize.define('Pay', {
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
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {});
const createOrder = async(user_id,item_id,name,price,number)=>{
    console.log(user_id,
        item_id,
        name,
        price,
        number)
    let res = null;
    try{
        const pr = Number(price)*Number(number)
        res = await Pay.create({
            user_id: user_id,
            item_id: item_id,
            name: name,
            price:  `${pr}`,
            number: number
        }, { fields: ['user_id',"item_id", 'name','price','number'] })
    } catch (err) {
        logger.error(err)
    }
    console.log(res)
    return res;
}
export const payDb = {
    createOrder
}

