const express = require('express')
const router = express.Router()
const { createNotice, getNotices, deleteNotice } = require('../controllers/notices.controller')
const { authenticate, requireRole } = require('../middleware/auth.middleware')

router.post('/create', authenticate, requireRole('admin', 'founder'), createNotice)
router.get('/', authenticate, getNotices)
router.delete('/:id', authenticate, requireRole('admin', 'founder'), deleteNotice)

module.exports = router