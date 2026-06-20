import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const STATUS_STYLES = {
  pending: 'bg-yellow-900 text-yellow-400',
  approved: 'bg-green-900 text-green-400',
  rejected: 'bg-red-900 text-red-400'
}

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
          <a
          key = { i }
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

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/submissions/my')
        setSubmissions(res.data.submissions)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [])

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
        <h2 className="text-2xl font-bold mb-6">My Submissions</h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-gray-400">No submissions yet. Submit your first work!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {submissions.map(sub => (
              <div key={sub.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-white font-medium text-lg">{sub.subject}</span>
                    {sub.language && (
                      <span className="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {sub.language}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_STYLES[sub.status]}`}>
                    {sub.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-2">
                  Questions Solved: <span className="text-white font-medium">{sub.questions_solved}</span>
                </p>

                {sub.remarks && (
                  <p className="text-gray-400 text-sm mb-2">
                    Remarks: <span className="text-gray-300">{sub.remarks}</span>
                  </p>
                )}

                {sub.reviewer_comment && (
                  <p className="text-red-400 text-sm mb-2">
                    Reviewer Comment: {sub.reviewer_comment}
                  </p>
                )}

                {sub.screenshot_url && (
                  <FileLinks urls={sub.screenshot_url} />
                )}

                <p className="text-gray-600 text-xs mt-3">
                  Submitted: {new Date(sub.submitted_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}