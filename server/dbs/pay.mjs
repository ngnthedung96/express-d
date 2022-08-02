import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'
const Pay = sequelize.define('Pay', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    note: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {});
const createOrder = async (user_id, note, date, time, details) => {
    let res = null;
    try {
        res = await Pay.create({
            user_id: user_id,
            note: note,
            date: date,
            time: time,
            detail: `[${details}]`
        }, { fields: ['user_id', 'note', 'date', 'time', "detail"] })
    } catch (err) {
        logger.error(err)
    }
    return res;
}

const findOrders = async (value, field) => {
    let res = null;
    try {
        res = await Pay.findAll(
            {
                where: { "user_id": value },
            }
        )
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}


export const payDb = {
    createOrder,
    findOrders
}

