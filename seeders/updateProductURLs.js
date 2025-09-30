const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary.config');

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, './updatedProducts.json'))
);

async function uploadProducts() {
  const updatedProducts = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    try {
      // Upload thumbnail
      const thumbnailPath = path.join(__dirname, '../uploads/images', path.basename(product.thumbnail));
      let thumbnailUrl = product.thumbnail;

      if (fs.existsSync(thumbnailPath)) {
        const result = await cloudinary.uploader.upload(thumbnailPath, {
          folder: 'echocart/products/thumbnails'
        });
        thumbnailUrl = result.secure_url;
      }

      // Upload images
      const imagesUrls = [];
      for (const img of product.images) {
        const imagePath = path.join(__dirname, '../uploads/images', path.basename(img));
        if (fs.existsSync(imagePath)) {
          const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'echocart/products/images'
          });
          imagesUrls.push(result.secure_url);
        }
      }

      updatedProducts.push({
        ...product,
        thumbnail: thumbnailUrl,
        images: imagesUrls
      });

      console.log(`✅ Uploaded product ${i + 1}/${products.length}`);
    } catch (err) {
      console.error(`❌ Error uploading product ${i + 1}:`, err.message || err);
    }
  }

  fs.writeFileSync(
    path.join(__dirname, './cloudinaryProducts.json'),
    JSON.stringify(updatedProducts, null, 2)
  );

  console.log('🎉 All products processed. JSON saved as cloudinaryProducts.json');
}

uploadProducts();
