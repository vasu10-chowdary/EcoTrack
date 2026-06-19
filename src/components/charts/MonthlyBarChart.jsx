import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { DAILY_AVERAGE_CO2 } from '../../data/emissionFactors';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const value = payload[0]?.value;
    const target = DAILY_AVERAGE_CO2 * 30;
    const isOver = value > target;
    return (
      <div style={{
        background: 'rgba(15,23,42,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '10px 14px',
      }}>
        <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: isOver ? '#ef4444' : '#10b981', fontSize: '12px' }}>
          {value?.toFixed(1)} kg CO₂
        </p>
        <p style={{ color: '#64748b', fontSize: '11px' }}>
          Target: {target.toFixed(1)} kg
        </p>
      </div>
    );
  }
  return null;
};

export default function MonthlyBarChart({ data }) {
  const { isDark } = useTheme();

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        No monthly data available yet
      </div>
    );
  }

  const target = DAILY_AVERAGE_CO2 * 30;
  const axisColor = isDark ? '#475569' : '#94a3b8';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={target} stroke="#f59e0b" strokeDasharray="4 4"
          label={{ value: 'Target', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
        <Bar dataKey="emissions" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.emissions > target
                ? 'url(#barRed)'
                : 'url(#barGreen)'}
            />
          ))}
        </Bar>
        <defs>
          <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#0d9488" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
