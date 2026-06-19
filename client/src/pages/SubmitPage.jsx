import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const SUBJECTS = ['DSA', 'OS', 'DBMS', 'CN', 'OOP', 'Language']
const LANGUAGES = ['Java', 'C++', 'Python', 'C', 'JavaScript']

export default function SubmitPage() {
  const [subject, setSubject] = useState('')
  const [language, setLanguage] = useState('')
  const [questionsSolved, setQuestionsSolved] = useState('')
  const [remarks, setRemarks] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('subject', subject)
      formData.append('language', language)
      formData.append('questions_solved', questionsSolved)
      formData.append('remarks', remarks)
      if (screenshot) formData.append('screenshot', screenshot)

      await api.post('/submissions/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSuccess('Submission sent! Waiting for supervisor approval.')
      setTimeout(() => navigate('/dashboard'), 2000)

    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
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

      <div className="max-w-xl mx-auto px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Submit Today's Work</h2>

        {error && <p className="text-red-400 bg-red-900 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        {success && <p className="text-green-400 bg-green-900 p-3 rounded-lg mb-4 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select subject</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select language</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Questions Solved</label>
            <input
              type="number"
              value={questionsSolved}
              onChange={(e) => setQuestionsSolved(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number"
              min="1"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What did you study today?"
              rows={3}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Screenshot Proof</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files[0])}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium mt-2 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Work'}
          </button>
        </form>
      </div>
    </div>
  )
}