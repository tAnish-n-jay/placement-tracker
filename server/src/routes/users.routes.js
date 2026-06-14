const express = require('express')
const router = express.Router()
const { createUser, activateUser, toggleRole } = require('../controllers/users.controller')
const { authenticate, requireRole } = require('../middleware/auth.middleware')

router.post('/create', authenticate, requireRole('admin', 'founder'), createUser)
router.patch('/:id/activate', authenticate, requireRole('admin', 'founder'), activateUser)
router.patch('/:id/role', authenticate, requireRole('admin', 'founder'), toggleRole)

module.exports = router