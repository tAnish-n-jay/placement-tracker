export default function StatsCards({ data }) {
  const stats = [
    { label: 'Current Streak', value: `${data?.streak?.current || 0} 🔥`, color: 'text-orange-400' },
    { label: 'Max Streak', value: `${data?.streak?.max || 0} days`, color: 'text-yellow-400' },
    { label: 'Total Questions', value: data?.total_questions || 0, color: 'text-blue-400' },
    { label: 'Total Submissions', value: data?.total_submissions || 0, color: 'text-green-400' },
    { label: 'Badges Earned', value: data?.badges?.length || 0, color: 'text-purple-400' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}