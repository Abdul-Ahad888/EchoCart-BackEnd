const express = require('express')
const router = express.Router()
const { dailyRevenue, orderStatusSummary, userByCountry, monthlyRevenue } = require('../controller/admin.controller');
const authenticateUser = require('../middleware/user.middleware')

router.get('/daily-revenue', authenticateUser, dailyRevenue);
router.get('/order-summary', authenticateUser, orderStatusSummary);
router.get('/users-count', authenticateUser, userByCountry);
router.get('/monthly-revenue', authenticateUser, monthlyRevenue);

module.exports = router