import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { WEEKLY_STATS } from '@/data/weeklyStats'

export function WeeklyCompletionChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={WEEKLY_STATS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#2c3340" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#9ca6ba', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9ca6ba', fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            cursor={{ fill: '#1f2530' }}
            contentStyle={{ borderRadius: 8, border: '1px solid #2c3340', background: '#131720', color: '#f5f7fa', fontSize: 12 }}
            formatter={(value) => [`${value}%`, 'Completion rate']}
          />
          <Bar dataKey="completionRate" fill="#d9af5b" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
