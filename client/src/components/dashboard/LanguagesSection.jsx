export default function LanguagesSection({ data }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-white font-semibold text-lg mb-4">Languages</h2>
      {!data || data.length === 0 ? (
        <p className="text-gray-400 text-sm">No data yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((lang, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                {lang.language}
              </span>
              <span className="text-white font-medium">
                {lang.total} problems solved
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}