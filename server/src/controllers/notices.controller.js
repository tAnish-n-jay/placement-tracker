const pool = require('../config/db')

const createNotice = async (req, res) => {
  const { title, body } = req.body
  const created_by = req.user.id

  try {
    const result = await pool.query(
      `INSERT INTO notices (created_by, title, body)
       VALUES ($1, $2, $3) RETURNING *`,
      [created_by, title, body]
    )

    res.status(201).json({ message: 'Notice created', notice: result.rows[0] })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getNotices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT n.*, u.name as created_by_name
       FROM notices n
       JOIN users u ON n.created_by = u.id
       ORDER BY n.created_at DESC`
    )

    res.json({ notices: result.rows })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteNotice = async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM notices WHERE id = $1', [id])
    res.json({ message: 'Notice deleted' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createNotice, getNotices, deleteNotice }