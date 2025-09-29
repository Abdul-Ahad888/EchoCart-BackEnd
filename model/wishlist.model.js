const { DataTypes } = require('sequelize')
const sequelize = require("../config/db.config");
const User = require('./user.model')
const Product = require('./product.model')

const Wishlist = sequelize.define('Wishlist', {

    id : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId : {
        type: DataTypes.UUID,
        allowNull: false,
    },
    productId : {
        type: DataTypes.UUID,
        allowNull: false,
    }
})


// RelationShips :

Wishlist.belongsTo(User, { foreignKey : 'userId' })
Wishlist.belongsTo(Product, { foreignKey : 'productId' })


module.exports = Wishlist