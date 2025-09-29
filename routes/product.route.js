const express = require('express')
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview, getUserReviews, editReview, deleteReview, totalProducts } = require('../controller/product.controller');
const authenticateUser = require('../middleware/user.middleware');
const uploadImage = require('../middleware/upload.middleware')

const router = express.Router();

router.get('/total-products', authenticateUser, totalProducts)

router.get('/', getAllProducts)
router.post('/', uploadImage.fields([{ name: "thumbnail", maxCount: 1}, {name: "images", maxCount: 5 }]), createProduct)

router.get('/reviews/:email', getUserReviews)
router.post('/:id/reviews', addReview)
router.put('/:id/reviews', editReview)
router.delete('/:id/reviews', deleteReview)

router.get('/:id', getProductById)
router.put('/:id', uploadImage.fields([{ name: "thumbnail", maxCount: 1}, {name: "images", maxCount: 5 }]), updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
