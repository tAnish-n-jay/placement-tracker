const pool = require('../config/db')
const bcrypt = require('bcrypt')

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, is_active)
       VALUES ($1, $2, $3, $4, false) RETURNING id, name, email, role, is_active`,
      [name, email, hashedPassword, role || 'member']
    )

    res.status(201).json({ message: 'User created', user: result.rows[0] })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const activateUser = async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      `UPDATE users SET is_active = true WHERE id = $1 RETURNING id, name, email, is_active`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User activated', user: result.rows[0] })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const toggleRole = async (req, res) => {
  const { id } = req.params

  try {
    // Get current role
    const current = await pool.query('SELECT role FROM users WHERE id = $1', [id])

    if (current.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const currentRole = current.rows[0].role

    // Only toggle between member and supervisor
    if (!['member', 'supervisor'].includes(currentRole)) {
      return res.status(400).json({ message: 'Cannot toggle this role' })
    }

    const newRole = currentRole === 'member' ? 'supervisor' : 'member'

    const result = await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role`,
      [newRole, id]
    )

    res.json({ message: `Role changed to ${newRole}`, user: result.rows[0] })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
const changePassword = async (req, res) => {
  const { current_password, new_password } = req.body
  const user_id = req.user.id

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [user_id])
    const user = result.rows[0]

    const isMatch = await bcrypt.compare(current_password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is wrong' })
    }

    const hashed = await bcrypt.hash(new_password, 10)
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, user_id])

    res.json({ message: 'Password changed successfully' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createUser, activateUser, toggleRole, changePassword }