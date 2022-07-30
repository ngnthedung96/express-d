import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

const Items = sequelize.define('Items', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {});

const findItems = async (value, field) => {
    let res = null;
    try {
        res = await Items.findAll()
    }
    catch(err) {
        logger.error(err)
    }
    return res;
  }

export const itemsDb = {
    findItems
}
