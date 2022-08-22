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
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
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
    checkCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shipFee: {
        type: DataTypes.STRING,
        allowNull: false
    },
    staffFee: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {});
const createOrder = async (user_id, note, price, code, date, time, checkCode, shipFee, staffFee, rate, details) => {
    let res = null;
    try {
        res = await Pay.create({
            user_id: user_id,
            note: note,
            price: price,
            code: code,
            date: date,
            time: time,
            checkCode: checkCode,
            shipFee,
            staffFee,
            rate,
            detail: `[${details}]`
        }, {
            fields: ['user_id', 'note', 'price', 'code', 'date', 'time', 'checkCode', "shipFee",
                "staffFee", "rate", "detail"]
        })
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

const findAllOrders = async (value, field) => {
    let res = null;
    try {
        res = await Pay.findAll(
        )
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}


export const payDb = {
    createOrder,
    findOrders,
    findAllOrders
}

