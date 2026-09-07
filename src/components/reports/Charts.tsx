import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BLOCKED_REASONS_STATS, DEPARTMENT_COMPLETION, EMPLOYEE_COMPLETION, WEEKLY_STATS } from '@/data/weeklyStats'

const AXIS_TICK = { fill: '#9ca6ba', fontSize: 12 }
const GRID = '#2c3340'
const TOOLTIP_STYLE = { borderRadius: 8, border: '1px solid #2c3340', background: '#131720', color: '#f5f7fa', fontSize: 12 }

export function OnTimeVsLateChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={WEEKLY_STATS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={AXIS_TICK} />
          <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} tickFormatter={(v) => `${v}%`} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#1f2530' }} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#9ca6ba' }} />
          <Bar dataKey="onTime" name="On time" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} maxBarSize={36} />
          <Bar dataKey="late" name="Late" stackId="a" fill="#fbbf24" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DepartmentCompletionChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={DEPARTMENT_COMPLETION} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid horizontal={false} stroke={GRID} />
          <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={AXIS_TICK} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="department" tickLine={false} axisLine={false} tick={AXIS_TICK} width={130} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#1f2530' }} formatter={(v) => [`${v}%`, 'Completion']} />
          <Bar dataKey="rate" fill="#d9af5b" radius={[0, 6, 6, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function EmployeeCompletionChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={EMPLOYEE_COMPLETION} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ ...AXIS_TICK, fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
          <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#1f2530' }} formatter={(v) => [`${v}%`, 'Completion rate']} />
          <Bar dataKey="rate" fill="#38bdf8" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const PIE_COLORS = ['#d9af5b', '#fb7185', '#fbbf24', '#38bdf8', '#a78bfa', '#9ca6ba']

export function BlockedReasonsChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={BLOCKED_REASONS_STATS} dataKey="count" nameKey="reason" innerRadius={50} outerRadius={85} paddingAngle={2}>
            {BLOCKED_REASONS_STATS.map((entry, i) => (
              <Cell key={entry.reason} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 11, color: '#9ca6ba' }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
