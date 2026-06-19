import { useState } from 'react'
import api from '../../api/axios'

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await api.patch('/users/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      })
      setMessage(res.data.message)
      setTimeout(() => onClose(), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-white font-semibold text-lg mb-4">Change Password</h2>

        {message && <p className="text-green-400 text-sm mb-3">{message}</p>}
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}