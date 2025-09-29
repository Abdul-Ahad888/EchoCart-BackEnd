const express = require('express')
const { userDetails, register, logIn, uploadProfileImage, changePassword, totalUser, getAllUsers, updateUserRole } = require('../controller/user.controller')
const authenticateUser = require('../middleware/user.middleware')
const updateLastActive = require('../middleware/updateLastActive')
const authorizeRoles = require('../middleware/authRole.middleware')
const upload = require('../middleware/upload.middleware')

const router = express.Router()

router.post('/logIn', logIn)

router.post('/register', register)

router.patch('/:id/role', authenticateUser, authorizeRoles("owner"), updateUserRole)

router.post('/upload-profile-image', authenticateUser, updateLastActive, upload.single('image'), uploadProfileImage)

router.post('/change-password', authenticateUser, updateLastActive, changePassword)

router.get('/userDetails', authenticateUser, updateLastActive, userDetails)

router.get('/total-users', authenticateUser, totalUser)

router.get('/protected', authenticateUser, (req, res) => {
    res.status(200).json({ msg: "You are authenticated", user: req.user })
})

router.get('/getUsers', authenticateUser, getAllUsers)


module.exports = router