export default function NoticeCard({ notice }) {
  return (
    <div className="bg-blue-900 border border-blue-700 rounded-xl p-4">
      <p className="text-blue-300 font-medium">{notice.title}</p>
      <p className="text-blue-200 text-sm mt-1">{notice.body}</p>
    </div>
  )
}