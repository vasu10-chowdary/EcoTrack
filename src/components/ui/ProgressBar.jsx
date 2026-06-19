import { useTheme } from '../../context/ThemeContext';

export default function ProgressBar({ value, max = 100, label, color = '#10b981', showLabel = true, size = 'md', animated = true }) {
  const { isDark } = useTheme();
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
          <span className="text-xs font-bold" style={{ color }}>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full ${heights[size]} rounded-full overflow-hidden ${isDark ? 'bg-white/8' : 'bg-gray-200'}`}>
        <div
          className={`${heights[size]} rounded-full ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}
