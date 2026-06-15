const pool = require('../config/db')

const createSubmission = async (req, res) => {
  const { subject, language, questions_solved, remarks } = req.body
  const user_id = req.user.id
  const screenshot_url = req.file ? req.file.path : null

  try {
    const result = await pool.query(
      `INSERT INTO submissions (user_id, subject, language, questions_solved, screenshot_url, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [user_id, subject, language, questions_solved, screenshot_url]
    )

    res.status(201).json({ message: 'Submission created', submission: result.rows[0] })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getPending = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as user_name 
       FROM submissions s
       JOIN users u ON s.user_id = u.id
       WHERE s.status = 'pending'
       ORDER BY s.submitted_at ASC`
    )

    res.json({ submissions: result.rows })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const approveSubmission = async (req, res) => {
  const { id } = req.params

  try {
    // Get submission details
    const submission = await pool.query('SELECT * FROM submissions WHERE id = $1', [id])
    if (submission.rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found' })
    }

    const { user_id, questions_solved, subject } = submission.rows[0]

    // Approve the submission
    await pool.query(
      `UPDATE submissions SET status = 'approved', reviewed_at = NOW() WHERE id = $1`,
      [id]
    )

    // Update heatmap
    await pool.query(
      `INSERT INTO heatmap_entries (user_id, date, questions_count)
       VALUES ($1, CURRENT_DATE, $2)
       ON CONFLICT (user_id, date)
       DO UPDATE SET questions_count = heatmap_entries.questions_count + $2`,
      [user_id, questions_solved]
    )

    // Update streak
    const streakResult = await pool.query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [user_id]
    )

    if (streakResult.rows.length === 0) {
      // First ever submission
      await pool.query(
        `INSERT INTO streaks (user_id, current_streak, max_streak, last_activity_date)
         VALUES ($1, 1, 1, CURRENT_DATE)`,
        [user_id]
      )
    } else {
      const streak = streakResult.rows[0]
      const lastDate = new Date(streak.last_activity_date)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      let newStreak = streak.current_streak

      if (lastDate.toDateString() === yesterday.toDateString()) {
        // Submitted yesterday — continue streak
        newStreak = streak.current_streak + 1
      } else if (lastDate.toDateString() === today.toDateString()) {
        // Already submitted today — no change
        newStreak = streak.current_streak
      } else {
        // Missed days — reset
        newStreak = 1
      }

      const newMax = Math.max(newStreak, streak.max_streak)

      await pool.query(
        `UPDATE streaks SET current_streak = $1, max_streak = $2, last_activity_date = CURRENT_DATE
         WHERE user_id = $3`,
        [newStreak, newMax, user_id]
      )

      // Check badges
      const badges = await pool.query('SELECT * FROM badges WHERE required_streak <= $1', [newStreak])
      for (const badge of badges.rows) {
        await pool.query(
          `INSERT INTO user_badges (user_id, badge_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [user_id, badge.id]
        )
      }
    }

    res.json({ message: 'Submission approved' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const rejectSubmission = async (req, res) => {
  const { id } = req.params
  const { comment } = req.body

  try {
    const result = await pool.query(
      `UPDATE submissions SET status = 'rejected', reviewer_comment = $1, reviewed_at = NOW()
       WHERE id = $2 RETURNING *`,
      [comment, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Submission not found' })
    }

    res.json({ message: 'Submission rejected' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getMySubmissions = async (req, res) => {
  const user_id = req.user.id

  try {
    const result = await pool.query(
      `SELECT * FROM submissions WHERE user_id = $1 ORDER BY submitted_at DESC`,
      [user_id]
    )

    res.json({ submissions: result.rows })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createSubmission, getPending, approveSubmission, rejectSubmission, getMySubmissions }