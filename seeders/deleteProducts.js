const Product = require('../model/product.model')
const sequelize = require('../config/db.config')

const deleteProducts = async () => {

    try {
        await sequelize.sync()
        await Product.destroy({ where: { imported: true }})
        console.log("Products Deleted")

    } catch (err) {
        console.log("Error deleting products", err)
    } finally {
        process.exit()
    }
}


deleteProducts()