import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BLOCKED_REASONS_STATS, DEPARTMENT_COMPLETION, EMPLOYEE_COMPLETION, WEEKLY_STATS } from '@/data/weeklyStats'

const AXIS_TICK = { fill: '#7d818b', fontSize: 12 }
const GRID = '#e7e8ea'
const TOOLTIP_STYLE = { borderRadius: 8, border: '1px solid #e7e8ea', fontSize: 12 }

export function OnTimeVsLateChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={WEEKLY_STATS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={AXIS_TICK} />
          <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} tickFormatter={(v) => `${v}%`} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f6f6f7' }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="onTime" name="On time" stackId="a" fill="#059669" radius={[0, 0, 0, 0]} maxBarSize={36} />
          <Bar dataKey="late" name="Late" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={36} />
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
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f6f6f7' }} formatter={(v) => [`${v}%`, 'Completion']} />
          <Bar dataKey="rate" fill="#b3211d" radius={[0, 6, 6, 0]} maxBarSize={20} />
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
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f6f6f7' }} formatter={(v) => [`${v}%`, 'Completion rate']} />
          <Bar dataKey="rate" fill="#0284c7" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const PIE_COLORS = ['#b3211d', '#e2705f', '#f59e0b', '#0284c7', '#7c3aed', '#4b4e57']

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
          <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 11 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
