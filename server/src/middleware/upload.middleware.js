const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const isPDF = file.mimetype === 'application/pdf'
    const isWord = file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    return {
      folder: 'placement-tracker',
      resource_type: isPDF || isWord ? 'raw' : 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      public_id: `${Date.now()}-${file.originalname}`,
      flags: 'attachment'
    }
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
})

module.exports = upload