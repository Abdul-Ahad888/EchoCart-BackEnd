const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')

const User = sequelize.define('User', {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    selectGender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dob: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    selectCountry: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    phoneNum: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastActive: {
        type: DataTypes.DATE,
        defaultValue : DataTypes.NOW
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        type: DataTypes.ENUM("unassigned", "admin", "owner"),
        defaultValue : "unassigned"
    }

});

module.exports = User