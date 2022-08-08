import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'
const Sale = sequelize.define('Sale', {
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {});
const createSale = async (code, user_id) => {
    let res = null;
    try {
        res = await Sale.create({
            code: code,
            user_id: user_id
        }, { fields: ['code', 'user_id'] })
    } catch (err) {
        logger.error(err)
    }
    return res;
}


const findAllSale = async (value, field) => {
    let res = null;
    try {
        res = await Sale.findAll({}
        )
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

const findSalesOfUser = async (user_id, code, field) => {
    let res = null;
    try {
        res = await Sale.findOne({
            where: {
                "user_id": user_id,
                "code": code
            }
        }
        )
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

const deleteSale = async (value, field) => {
    let res = null;
    try {
        res = await Sale.destroy(
            {
                where: { "code": value },
            }
        )
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}


export const saleDb = {
    createSale,
    findAllSale,
    findSalesOfUser,
    deleteSale
}
