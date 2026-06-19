import { useTheme } from '../../context/ThemeContext';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ icon, label, value, unit, color, trend, trendValue, gradient, animate = true, delay = 0 }) {
  const { isDark } = useTheme();
  const animatedValue = useAnimatedCounter(animate ? parseFloat(value) || 0 : 0, 1500, 1);

  const displayValue = animate ? animatedValue : value;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'down' ? '#10b981' : trend === 'up' ? '#ef4444' : '#94a3b8';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-default
        animate-fade-in`}
      style={{
        animationDelay: `${delay}ms`,
        background: isDark
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(255,255,255,0.85)',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Background gradient orb */}
      {gradient && (
        <div
          className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-xl pointer-events-none"
          style={{ background: gradient }}
        />
      )}

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
            style={{ color: trendColor, background: `${trendColor}15` }}>
            <TrendIcon size={11} />
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span
          className="text-3xl font-bold tabular-nums"
          style={{ color }}
        >
          {typeof displayValue === 'number' ? displayValue.toFixed(1) : displayValue}
        </span>
        {unit && (
          <span className={`ml-1.5 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {unit}
          </span>
        )}
      </div>

      {/* Label */}
      <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
    </div>
  );
}
