import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const COLORS = {
  transportation: '#10b981',
  energy: '#3b82f6',
  food: '#f59e0b',
  waste: '#ef4444',
};

const LABELS = {
  transportation: '🚗 Transport',
  energy: '⚡ Energy',
  food: '🥗 Food',
  waste: '♻️ Waste',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, value } = payload[0];
    return (
      <div style={{
        background: 'rgba(15,23,42,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '10px 14px',
        backdropFilter: 'blur(8px)',
      }}>
        <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>
          {LABELS[name] || name}
        </p>
        <p style={{ color: '#94a3b8', fontSize: '12px' }}>
          {value.toFixed(2)} kg CO₂
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function EmissionPieChart({ breakdown }) {
  const { isDark } = useTheme();

  const data = Object.entries(breakdown || {})
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: key, value }));

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        No data yet — calculate your footprint first!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={CustomLabel}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={COLORS[entry.name] || '#6b7280'}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '12px' }}>
              {LABELS[value] || value}
            </span>
          )}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
