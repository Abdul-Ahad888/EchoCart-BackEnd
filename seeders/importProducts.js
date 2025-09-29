const fs = require('fs')
const Product = require('../model/product.model')
const sequelize = require('../config/db.config')

const products = JSON.parse(fs.readFileSync('./seeders/updatedProducts.json'))

// add boolean value true in imported column in product table while default value is set to false. 
const importedProducts = products.map(p => (
    {
        ...p,
        imported: true,
    }))
    
const importProducts = async () => {

    try {
        await sequelize.sync()
        await Product.bulkCreate(importedProducts)
        console.log("products imported successfully")

    } catch (err) {
        console.log("Error importing products", err)
    } finally {
        process.exit()
    }
}


importProducts()