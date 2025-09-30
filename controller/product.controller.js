const Product = require('../model/product.model')
const User = require('../model/user.model')
const cloudinary = require('../config/cloudinary.config');


const getAllProducts = async (req, res) => {
    try {
        const rawProducts = await Product.findAll();

        const products = rawProducts.map(product => {
            const p = product.toJSON();

            p.tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags;
            p.images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
            p.reviews = typeof p.reviews === 'string' ? JSON.parse(p.reviews) : p.reviews;

            return p;
        });

        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching products", error: err.message });
    }
};

const getProductById = async (req, res) => {

    try {
        const { id } = req.params
        const rawProducts = await Product.findByPk(id);

        if (!rawProducts) {
            return res.status(404).json({ msg: "Error Product Not Found" })
        }

        const product = rawProducts.toJSON()

        product.tags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags;
        product.images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        product.reviews = typeof product.reviews === 'string' ? JSON.parse(product.reviews) : product.reviews;

        res.status(200).json(product);

    } catch (err) {
        res.status(500).json({ msg: "Error fetching product", error: err.message })
    }
}

const createProduct = async (req, res) => {
    try {
        const {
            title, description, category, brand, price, discountPercentage,
            stock, weight, tags, warrantyInformation, shippingInformation, returnPolicy
        } = req.body;

        const thumbnailFile = req.files["thumbnail"] ? req.files["thumbnail"][0] : null;
        const thumbnailUrl = thumbnailFile ? thumbnailFile.path : null; // multer-cloudinary gives .path = secure_url

        const imageFiles = req.files["images"] || [];
        const imagesUrls = imageFiles.map(file => file.path);

        const newProduct = await Product.create({
            title,
            description,
            category,
            brand,
            price,
            discountPercentage,
            stock,
            weight,
            tags: tags ? JSON.parse(tags) : [],
            warrantyInformation,
            shippingInformation,
            returnPolicy,
            images: imagesUrls,
            thumbnail: thumbnailUrl,
            reviews: []
        });

        res.status(201).json({ msg: "Product Created Successfully", product: newProduct });
    } catch (err) {
        res.status(500).json({ msg: "Error While Creating Product", error: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        const {
            title, description, category, brand, price, discountPercentage,
            stock, weight, tags, warrantyInformation, shippingInformation, returnPolicy
        } = req.body;

        // Thumbnail
        let thumbnailUrl = product.thumbnail;
        if (req.files?.thumbnail && req.files.thumbnail.length > 0) {
            thumbnailUrl = req.files.thumbnail[0].path; // Cloudinary URL
        }

        // Images
        let imagesUrls = product.images || [];
        if (req.files?.images && req.files.images.length > 0) {
            imagesUrls = req.files.images.map(file => file.path); // Cloudinary URLs
        }

        await product.update({
            title: title || product.title,
            description: description || product.description,
            category: category || product.category,
            brand: brand || product.brand,
            price: price || product.price,
            discountPercentage: discountPercentage || product.discountPercentage,
            stock: stock || product.stock,
            weight: weight || product.weight,
            tags: tags ? JSON.parse(tags) : product.tags,
            warrantyInformation: warrantyInformation || product.warrantyInformation,
            shippingInformation: shippingInformation || product.shippingInformation,
            returnPolicy: returnPolicy || product.returnPolicy,
            thumbnail: thumbnailUrl,
            images: imagesUrls
        });

        res.status(200).json({ msg: "Product updated successfully", product });
    } catch (err) {
        res.status(500).json({ msg: "Error updating product", error: err.message });
    }
};

const deleteProduct = async (req, res) => {

    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if (!product) {
            return res.status(404).json({ msg: "Error Product Not Found" })
        }

        await product.destroy()
        res.status(200).json({ msg: "Product deleted successfully" })

    } catch (err) {
        res.status(500).json({ msg: 'Error deleting product', error: err.message });
    }
}



const addReview = async (req, res) => {

    try {
        const productId = req.params.id
        const { comment, rating, reviewerName, reviewerEmail } = req.body

        const product = await Product.findByPk(productId)
        if (!product) {
            return res.status(404).json({ msg: "product not found" })
        }

        let currentReviews = []

        if (product.reviews) {
            currentReviews = typeof product.reviews === "string" ? JSON.parse(product.reviews) : product.reviews
        }

        const newReview = {
            reviewerName: reviewerName,
            reviewerEmail: reviewerEmail,
            comment,
            rating,
            date: new Date()
        }

        currentReviews.push(newReview)
        product.reviews = currentReviews
        await product.save()

        res.status(200).json({ reviews: currentReviews })

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const editReview = async (req, res) => {
    try {
        const { id } = req.params
        const { reviewerEmail, comment, rating } = req.body

        const product = await Product.findByPk(id)
        if (!product) {
            return res.status(404).json({ msg: "Product not found" })
        }

        let reviews = typeof product.reviews === 'string' ? JSON.parse(product.reviews) : product.reviews

        const reviewIndex = reviews.findIndex(r => r.reviewerEmail === reviewerEmail)
        if (reviewIndex === -1) {
            return res.status(404).json({ msg: "Review not found" })
        }

        reviews[reviewIndex].comment = comment ?? reviews[reviewIndex].comment
        reviews[reviewIndex].rating = rating ?? reviews[reviewIndex].rating
        reviews[reviewIndex].date = new Date()

        product.reviews = reviews

        await product.save()

        res.status(200).json({ msg: "Review Update", reviews })

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const deleteReview = async (req, res) => {
    try {

        const { id } = req.params
        const { reviewerEmail } = req.body

        const product = await Product.findByPk(id)
        if (!product) {
            return res.status(404).json({ msg: "Product Not Found" })
        }

        let reviews = typeof product.reviews === 'string' ? JSON.parse(product.reviews) : product.reviews

        const newReviews = reviews.filter(r => r.reviewerEmail !== reviewerEmail)

        product.reviews = newReviews
        await product.save()

        res.status(200).json({ msg: "Review Deleted", reviews: newReviews })

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const getUserReviews = async (req, res) => {
    try {
        const { email } = req.params
        const products = await Product.findAll()

        let userReviews = []

        products.forEach((product) => {
            let reviews = typeof product.reviews === "string" ? JSON.parse(product.reviews) : product.reviews

            if (reviews && reviews.length > 0) {
                const filtered = reviews.filter(r => r.reviewerEmail === email)
                filtered.forEach(r => {
                    userReviews.push({
                        productId: product.id,
                        productThumbnail: product.thumbnail,
                        productTitle: product.title,
                        ...r
                    })
                })
            }
        })

        res.status(200).json({ reviews: userReviews })

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}



const totalProducts = async (req, res) => {
    try {
        const count = await Product.count()
        res.status(200).json({ totalProducts: count })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview, getUserReviews, editReview, deleteReview, totalProducts }