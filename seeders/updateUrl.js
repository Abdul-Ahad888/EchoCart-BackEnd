// seeders/updateCloudinaryURLs.js
const fs = require("fs");
const path = require("path");
const Product = require("../model/product.model"); 

// Load the products with new Cloudinary URLs
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./cloudinaryProducts.json"))
);

async function updateDB() {
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    try {
      await Product.update(
        {
          thumbnail: product.thumbnail,
          images: product.images,
        },
        { where: { id: product.id } }
      );
      console.log(`✅ Updated DB product ${i + 1}/${products.length}`);
    } catch (err) {
      console.error(`❌ Failed updating product ${product.id}:`, err.message);
    }
  }

  console.log("🎉 Database updated with Cloudinary URLs!");
}

updateDB()
  .then(() => process.exit())
  .catch((err) => {
    console.error("❌ Script error:", err);
    process.exit(1);
  });
