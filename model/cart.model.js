const { DataTypes } = require('sequelize')
const sequelize = require("../config/db.config");
const User = require('./user.model')
const Product = require('./product.model')


let Cart = null; // define in outer scope

if (sequelize) {
    const Cart = sequelize.define('Cart', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }

    })   
    
    // RelationShips :
    
    Cart.belongsTo(User, { foreignKey: 'userId' })
    Cart.belongsTo(Product, { foreignKey: 'productId' })
}



module.exports = Cart