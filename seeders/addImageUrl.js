const fs = require('fs')
const path = require('path')

const products = JSON.parse(fs.readFileSync(path.join(__dirname, './products.json')))

const updatedProducts = products.map((product, index) => {
    const imgUrl = `http://localhost:8000/images/product${index + 1}.jpg`

    return {
        ...product,
        thumbnail: imgUrl,
        images: [imgUrl]
    }
})

fs.writeFileSync(
    path.join(__dirname, './updatedProducts.json'),
    JSON.stringify(updatedProducts, null, 2)
)