const express = require('express')
const router = express.Router()
const { getDashboard } = require('../controllers/dashboard.controller')
const { authenticate } = require('../middleware/auth.middleware')

router.get('/', authenticate, getDashboard)

module.exports = router