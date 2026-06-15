const express = require('express')
const router = express.Router()
const { createSubmission, getPending, approveSubmission, rejectSubmission, getMySubmissions } = require('../controllers/submissions.controller')
const { authenticate, requireRole } = require('../middleware/auth.middleware')
const upload = require('../middleware/upload.middleware')

router.post('/create', authenticate, requireRole('member'), upload.single('screenshot'), createSubmission)
router.get('/pending', authenticate, requireRole('supervisor', 'admin', 'founder'), getPending)
router.patch('/:id/approve', authenticate, requireRole('supervisor', 'admin', 'founder'), approveSubmission)
router.patch('/:id/reject', authenticate, requireRole('supervisor', 'admin', 'founder'), rejectSubmission)
router.get('/my', authenticate, getMySubmissions)

module.exports = router