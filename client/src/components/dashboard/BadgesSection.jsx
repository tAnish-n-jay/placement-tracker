const BADGE_COLORS = {
  '7 Day Streak': 'from-green-400 to-green-600',
  '30 Day Streak': 'from-blue-400 to-blue-600',
  '50 Day Streak': 'from-purple-400 to-purple-600',
  '100 Day Streak': 'from-yellow-400 to-yellow-600',
  '200 Day Streak': 'from-orange-400 to-orange-600',
  '365 Day Streak': 'from-red-400 to-red-600',
}

export default function BadgesSection({ data }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-white font-semibold text-lg mb-4">
        Badges {data?.length > 0 && <span className="text-gray-400 text-sm ml-1">{data.length}</span>}
      </h2>
      {!data || data.length === 0 ? (
        <p className="text-gray-400 text-sm">No badges yet — keep your streak going!</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 mb-3">
            {data.map((badge, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${BADGE_COLORS[badge.name] || 'from-gray-400 to-gray-600'} p-3 rounded-xl text-center min-w-16`}
                title={`Earned on ${new Date(badge.earned_at).toLocaleDateString()}`}
              >
                <p className="text-white text-xs font-bold">{badge.name}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            Most Recent: <span className="text-white">{data[0]?.name}</span>
          </p>
        </>
      )}
    </div>
  )
}