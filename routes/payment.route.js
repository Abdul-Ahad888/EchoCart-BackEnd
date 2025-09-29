const express = require('express')
const { createCheckoutSession, getSession } = require('../controller/payment.controller')
const authenticateUser = require('../middleware/user.middleware')
const updateLastActive = require('../middleware/updateLastActive')

const router = express.Router()

router.post('/checkout', authenticateUser, updateLastActive, createCheckoutSession)
router.get('/checkout-session/:id', authenticateUser, updateLastActive, getSession)

module.exports = router