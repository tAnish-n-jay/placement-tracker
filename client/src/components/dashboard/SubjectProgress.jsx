const SUBJECTS = ['DSA', 'OS', 'DBMS', 'CN', 'OOP']
const COLORS = {
  DSA: 'bg-blue-500',
  OS: 'bg-green-500',
  DBMS: 'bg-yellow-500',
  CN: 'bg-purple-500',
  OOP: 'bg-pink-500'
}

export default function SubjectProgress({ data }) {
  const getTotal = (subject) => {
    const found = data?.find(d => d.subject === subject)
    return parseInt(found?.total || 0)
  }

  const max = Math.max(...SUBJECTS.map(getTotal), 1)

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-white font-semibold text-lg mb-4">Subject Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {SUBJECTS.map(subject => {
          const total = getTotal(subject)
          const percent = Math.round((total / max) * 100)

          return (
            <div key={subject} className="bg-gray-700 rounded-xl p-4 flex flex-col gap-2">
              <p className="text-white font-medium">{subject}</p>
              <p className="text-gray-400 text-sm">{total} questions</p>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className={`${COLORS[subject]} h-2 rounded-full transition-all`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-gray-400 text-xs">{percent}%</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}