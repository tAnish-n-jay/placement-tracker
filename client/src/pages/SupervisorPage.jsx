import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function FileLinks({ urls }) {
    let parsedUrls = []
    try {
        parsedUrls = JSON.parse(urls)
    } catch {
        parsedUrls = [urls]
    }

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {parsedUrls.map((url, i) => {
                const isPDF = url.includes('.pdf')
                const isWord = url.includes('.doc')
                const label = isPDF ? '📄 PDF' : isWord ? '📝 Word' : '🖼️ Image'
                const openUrl = isPDF || isWord
                    ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`
                    : url

                return (

                <a   key = { i }
            href = { openUrl }
                target = "_blank"
                rel = "noopener noreferrer"
                className = "text-blue-400 text-sm hover:underline bg-gray-700 px-3 py-1 rounded-full"
                    >
                    { label } { i + 1 } →
        </a>
    )
})}
    </div >
  )
}

export default function SupervisorPage() {
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState({})
    const navigate = useNavigate()

    const fetchPending = async () => {
        try {
            const res = await api.get('/submissions/pending')
            setSubmissions(res.data.submissions)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPending()
    }, [])

    const handleApprove = async (id) => {
        try {
            await api.patch(`/submissions/${id}/approve`)
            setSubmissions(prev => prev.filter(s => s.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    const handleReject = async (id) => {
        try {
            await api.patch(`/submissions/${id}/reject`, {
                comment: comment[id] || ''
            })
            setSubmissions(prev => prev.filter(s => s.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 px-8 py-4 flex justify-between items-center border-b border-gray-700">
                <h1 className="text-xl font-bold text-blue-400">Placement Tracker</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="max-w-4xl mx-auto px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">
                    Pending Submissions
                    <span className="ml-2 text-sm text-gray-400 font-normal">
                        {submissions.length} pending
                    </span>
                </h2>

                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : submissions.length === 0 ? (
                    <p className="text-gray-400">No pending submissions!</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {submissions.map(sub => (
                            <div key={sub.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-white font-medium text-lg">{sub.user_name}</p>
                                        <p className="text-gray-400 text-sm">{sub.subject} {sub.language && `· ${sub.language}`}</p>
                                    </div>
                                    <p className="text-gray-400 text-xs">
                                        {new Date(sub.submitted_at).toLocaleString()}
                                    </p>
                                </div>

                                <p className="text-gray-400 text-sm mb-2">
                                    Questions Solved: <span className="text-white font-medium">{sub.questions_solved}</span>
                                </p>

                                {sub.remarks && (
                                    <p className="text-gray-400 text-sm mb-2">
                                        Remarks: <span className="text-gray-300">{sub.remarks}</span>
                                    </p>
                                )}

                                {sub.screenshot_url && (
                                    <FileLinks urls={sub.screenshot_url} />
                                )}

                                <div className="mt-4">
                                    <textarea
                                        placeholder="Add comment (optional, shown on reject)"
                                        value={comment[sub.id] || ''}
                                        onChange={(e) => setComment(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                        className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none text-sm mb-3"
                                        rows={2}
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApprove(sub.id)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm"
                                        >
                                            ✅ Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(sub.id)}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm"
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}