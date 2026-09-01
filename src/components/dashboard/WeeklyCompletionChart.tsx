import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { WEEKLY_STATS } from '@/data/weeklyStats'

export function WeeklyCompletionChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={WEEKLY_STATS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e7e8ea" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#7d818b', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#7d818b', fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            cursor={{ fill: '#f6f6f7' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #e7e8ea', fontSize: 12 }}
            formatter={(value) => [`${value}%`, 'Completion rate']}
          />
          <Bar dataKey="completionRate" fill="#b3211d" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
