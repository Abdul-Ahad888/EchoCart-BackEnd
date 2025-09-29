const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    discountPercentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    tags: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    warrantyInformation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shippingInformation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    returnPolicy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reviews: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    imported: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Product;
