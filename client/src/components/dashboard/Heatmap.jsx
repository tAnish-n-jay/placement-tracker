import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'

export default function Heatmap({ data }) {
  const today = new Date()
  const startDate = new Date()
  startDate.setFullYear(today.getFullYear() - 1)

  const values = data?.map(entry => ({
    date: entry.date.split('T')[0],
    count: entry.questions_count
  })) || []

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-white font-semibold text-lg mb-4">Activity Heatmap</h2>
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === 0) return 'color-empty'
          if (value.count < 3) return 'color-scale-1'
          if (value.count < 6) return 'color-scale-2'
          if (value.count < 10) return 'color-scale-3'
          return 'color-scale-4'
        }}
        tooltipDataAttrs={(value) => ({
          'data-tip': value?.date ? `${value.date}: ${value.count} questions` : 'No activity'
        })}
      />
    </div>
  )
}