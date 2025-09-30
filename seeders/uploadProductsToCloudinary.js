const Product = require('../model/product.model');
const fs = require('fs');
const path = require('path');

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, './updatedProducts.json'))
);

async function seedProducts() {
  for (const product of products) {
    const [affected] = await Product.update(
      {
        thumbnail: product.thumbnail,
        images: product.images
      },
      { where: { id: product.id } }
    );

    console.log(
      `Product ${product.id} → ${affected} row(s) updated`
    );
  }
  console.log('✅ Product URLs updated in DB');
}

seedProducts()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
