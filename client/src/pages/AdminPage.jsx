import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function AdminPage() {
    const [users, setUsers] = useState([])
    const [notices, setNotices] = useState([])
    const [loading, setLoading] = useState(true)
    const [noticeTitle, setNoticeTitle] = useState('')
    const [noticeBody, setNoticeBody] = useState('')
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'member' })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const [usersRes, noticesRes] = await Promise.all([
                api.get('/users'),
                api.get('/notices')
            ])
            setUsers(usersRes.data.users)
            setNotices(noticesRes.data.notices)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCreateUser = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        try {
            await api.post('/users/create', newUser)
            setMessage('User created successfully!')
            setNewUser({ name: '', email: '', password: '', role: 'member' })
            fetchData()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user')
        }
    }

    const handleActivate = async (id) => {
        try {
            await api.patch(`/users/${id}/activate`)
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const handleToggleRole = async (id) => {
        try {
            await api.patch(`/users/${id}/role`)
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return
        try {
            await api.delete(`/users/${id}`)
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const handleCreateNotice = async (e) => {
        e.preventDefault()
        try {
            await api.post('/notices/create', { title: noticeTitle, body: noticeBody })
            setNoticeTitle('')
            setNoticeBody('')
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteNotice = async (id) => {
        try {
            await api.delete(`/notices/${id}`)
            fetchData()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 px-8 py-4 flex justify-between items-center border-b border-gray-700">
                <h1 className="text-xl font-bold text-blue-400">Placement Tracker — Admin</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col gap-8">

                {/* Create User */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-lg font-semibold mb-4">Create New User</h2>
                    {message && <p className="text-green-400 text-sm mb-3">{message}</p>}
                    {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
                    <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="member">Member</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button
                            type="submit"
                            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium"
                        >
                            Create User
                        </button>
                    </form>
                </div>

                {/* User Management */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-lg font-semibold mb-4">User Management</h2>
                    {loading ? (
                        <p className="text-gray-400">Loading...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400 border-b border-gray-700">
                                        <th className="text-left py-2 pr-4">Name</th>
                                        <th className="text-left py-2 pr-4">Email</th>
                                        <th className="text-left py-2 pr-4">Role</th>
                                        <th className="text-left py-2 pr-4">Active</th>
                                        <th className="text-left py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="border-b border-gray-700">
                                            <td className="py-3 pr-4 text-white">{user.name}</td>
                                            <td className="py-3 pr-4 text-gray-400">{user.email}</td>
                                            <td className="py-3 pr-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-900 text-purple-400' :
                                                        user.role === 'supervisor' ? 'bg-blue-900 text-blue-400' :
                                                            'bg-gray-700 text-gray-300'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 pr-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                                                    }`}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex gap-2 flex-wrap">
                                                    {!user.is_active && (
                                                        <button
                                                            onClick={() => handleActivate(user.id)}
                                                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs"
                                                        >
                                                            Activate
                                                        </button>
                                                    )}
                                                    {['member', 'supervisor'].includes(user.role) && (
                                                        <button
                                                            onClick={() => handleToggleRole(user.id)}
                                                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-xs"
                                                        >
                                                            {user.role === 'member' ? 'Make Supervisor' : 'Make Member'}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-xs"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Notice Management */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-lg font-semibold mb-4">Notice Management</h2>
                    <form onSubmit={handleCreateNotice} className="flex flex-col gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Notice Title"
                            value={noticeTitle}
                            onChange={(e) => setNoticeTitle(e.target.value)}
                            className="bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <textarea
                            placeholder="Notice Body"
                            value={noticeBody}
                            onChange={(e) => setNoticeBody(e.target.value)}
                            className="bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium"
                        >
                            Post Notice
                        </button>
                    </form>

                    <div className="flex flex-col gap-3">
                        {notices.map(notice => (
                            <div key={notice.id} className="bg-gray-700 rounded-xl p-4 flex justify-between items-start">
                                <div>
                                    <p className="text-white font-medium">{notice.title}</p>
                                    <p className="text-gray-400 text-sm mt-1">{notice.body}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteNotice(notice.id)}
                                    className="text-red-400 hover:text-red-300 text-sm ml-4"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}