const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary.config');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "echocart/users/profiles",
    allowedFormats: ['jpg', 'jpeg', 'png'],
  },
});




// const path = require('path')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
// })


// File Filter
// function fileFilter(req, file, cb) {

//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true)
//     } else {
//         cb(new Error('only .jpeg, jpg, or png formats are allowed'), false)
//     }
// }


const upload = multer({ storage})

module.exports = upload