import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import StatsCards from '../components/dashboard/StatsCards'
import SubjectProgress from '../components/dashboard/SubjectProgress'
import LanguagesSection from '../components/dashboard/LanguagesSection'
import BadgesSection from '../components/dashboard/BadgesSection'
import Heatmap from '../components/dashboard/Heatmap'
import NoticeCard from '../components/common/NoticeCard'
import ChangePasswordModal from '../components/common/ChangePasswordModal'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showChangePassword, setShowChangePassword] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, noticeRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/notices')
        ])
        setDashboard(dashRes.data)
        setNotices(noticeRes.data.notices)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white text-lg">Loading dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <div className="bg-gray-800 px-8 py-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">Placement Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user?.name}</span>

          {['supervisor', 'admin', 'founder'].includes(user?.role) && (
            <button
              onClick={() => navigate('/supervisor')}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
            >
              Review Submissions
            </button>
          )}

          {['admin', 'founder'].includes(user?.role) && (
            <button
              onClick={() => navigate('/admin')}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
            >
              Admin Panel
            </button>
          )}

          <button
            onClick={() => navigate('/submit')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
          >
            Submit Work
          </button>

          <button
            onClick={() => navigate('/history')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
          >
            My Submissions
          </button>

          <button
            onClick={() => setShowChangePassword(true)}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
          >
            Change Password
          </button>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col gap-6">
        {/* Notices */}
        {notices.length > 0 && (
          <div className="flex flex-col gap-2">
            {notices.map(notice => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}

        {/* Stats */}
        <StatsCards data={dashboard} />

        {/* Heatmap */}
        {/* Heatmap */}
        {user?.role === 'member' && (
          <Heatmap data={dashboard?.heatmap} />
        )}

        {/* Subject Progress */}
        <SubjectProgress data={dashboard?.subject_breakdown} />

        {/* Languages + Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LanguagesSection data={dashboard?.language_breakdown} />
          <BadgesSection data={dashboard?.badges} />
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  )
}