import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { DAILY_AVERAGE_CO2 } from '../../data/emissionFactors';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'rgba(15,23,42,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '10px 14px',
      }}>
        <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color, fontSize: '12px' }}>
            {p.dataKey === 'emissions' ? '💨 Emissions: ' : '🎯 Target: '}
            {p.value?.toFixed(2)} kg CO₂
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function WeeklyLineChart({ data }) {
  const { isDark } = useTheme();

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        No weekly data available yet
      </div>
    );
  }

  const axisColor = isDark ? '#475569' : '#94a3b8';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="emissionsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={DAILY_AVERAGE_CO2} stroke="#f59e0b" strokeDasharray="4 4"
          label={{ value: 'Avg', fill: '#f59e0b', fontSize: 10 }} />
        <Area type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={1.5}
          fill="url(#targetGrad)" strokeDasharray="4 4" dot={false} />
        <Area type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={2.5}
          fill="url(#emissionsGrad)"
          dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: '#10b981', stroke: 'white', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
