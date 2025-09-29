const sequelize = require('../config/db.config')
const { DataTypes } = require('sequelize')
const User = require('./user.model')

let Order = null;

if (sequelize) {
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customerEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    appartment: {
        type: DataTypes.STRING
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    status: {
        type: DataTypes.ENUM("processing", "delivered", "canceled"),
        defaultValue: "processing"
    }

})

Order.belongsTo(User, { foreignKey: "userId" })
}


module.exports = Order
