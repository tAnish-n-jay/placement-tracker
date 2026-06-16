const pool = require('../config/db')

const getDashboard = async (req, res) => {
  const user_id = req.user.id

  try {
    // Get streak
    const streakResult = await pool.query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [user_id]
    )
    const streak = streakResult.rows[0] || { current_streak: 0, max_streak: 0 }

    // Get total questions solved and subject breakdown
    const subjectResult = await pool.query(
      `SELECT subject, SUM(questions_solved) as total
       FROM submissions
       WHERE user_id = $1 AND status = 'approved'
       GROUP BY subject`,
      [user_id]
    )

    // Get total questions solved
    const totalResult = await pool.query(
      `SELECT SUM(questions_solved) as total
       FROM submissions
       WHERE user_id = $1 AND status = 'approved'`,
      [user_id]
    )

    // Get language breakdown
    const languageResult = await pool.query(
      `SELECT language, SUM(questions_solved) as total
       FROM submissions
       WHERE user_id = $1 AND status = 'approved' AND language IS NOT NULL
       GROUP BY language`,
      [user_id]
    )

    // Get badges
    const badgeResult = await pool.query(
      `SELECT b.name, b.description, ub.earned_at
       FROM user_badges ub
       JOIN badges b ON ub.badge_id = b.id
       WHERE ub.user_id = $1
       ORDER BY ub.earned_at DESC`,
      [user_id]
    )

    // Get heatmap data (last 365 days)
    const heatmapResult = await pool.query(
      `SELECT date, questions_count
       FROM heatmap_entries
       WHERE user_id = $1
       AND date >= CURRENT_DATE - INTERVAL '365 days'
       ORDER BY date ASC`,
      [user_id]
    )

    // Get total submissions count
    const submissionsCount = await pool.query(
      'SELECT COUNT(*) as total FROM submissions WHERE user_id = $1',
      [user_id]
    )

    res.json({
      streak: {
        current: streak.current_streak,
        max: streak.max_streak
      },
      total_questions: parseInt(totalResult.rows[0]?.total || 0),
      total_submissions: parseInt(submissionsCount.rows[0]?.total || 0),
      subject_breakdown: subjectResult.rows,
      language_breakdown: languageResult.rows,
      badges: badgeResult.rows,
      heatmap: heatmapResult.rows
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getDashboard }