const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/users.routes')
const submissionRoutes = require('./routes/submissions.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/submissions', submissionRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

module.exports = app