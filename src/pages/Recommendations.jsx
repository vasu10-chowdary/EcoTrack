import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { generateRecommendations } from '../utils/recommendations';
import ProgressBar from '../components/ui/ProgressBar';
import { Calculator, ChevronRight, Leaf, AlertTriangle, Info, TrendingDown } from 'lucide-react';

const PRIORITY_META = {
  high: { label: 'High Impact', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  medium: { label: 'Medium Impact', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  low: { label: 'Low Impact', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
};

const CATEGORY_META = {
  transportation: { color: '#10b981', label: 'Transportation' },
  energy: { color: '#3b82f6', label: 'Energy' },
  food: { color: '#f59e0b', label: 'Food' },
  waste: { color: '#ef4444', label: 'Waste' },
  general: { color: '#8b5cf6', label: 'General' },
};

function RecommendationCard({ rec, index }) {
  const { isDark } = useTheme();
  const priority = PRIORITY_META[rec.priority];
  const category = CATEGORY_META[rec.category] || CATEGORY_META.general;

  return (
    <div
      className={`p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 animate-fade-in`}
      style={{
        animationDelay: `${index * 60}ms`,
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.95)',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{rec.icon}</span>
          <h3 className={`font-bold text-sm leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {rec.title}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: priority.bg, color: priority.color, border: `1px solid ${priority.border}` }}>
            {priority.label}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${category.color}12`, color: category.color, border: `1px solid ${category.color}25` }}>
            {category.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {rec.description}
      </p>

      {/* CO₂ savings */}
      {rec.co2Savings > 0 && (
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-eco-400">
          <TrendingDown size={13} />
          Save up to {rec.co2Savings.toFixed(2)} kg CO₂/day
        </div>
      )}

      {/* Actions */}
      {rec.actions?.length > 0 && (
        <div className={`rounded-xl p-3 space-y-1.5 ${isDark ? 'bg-white/4' : 'bg-gray-50'}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Action Steps
          </p>
          {rec.actions.map((action, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <ChevronRight size={12} className="text-eco-400 shrink-0 mt-0.5" />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{action}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Recommendations() {
  const { isDark } = useTheme();
  const { calculatorData, emissions } = useApp();

  const recommendations = useMemo(
    () => generateRecommendations(calculatorData, emissions),
    [calculatorData, emissions]
  );

  const highCount = recommendations.filter((r) => r.priority === 'high').length;
  const totalSavings = recommendations.reduce((a, r) => a + (r.co2Savings || 0), 0);

  if (!emissions) {
    return (
      <div className={`min-h-screen pt-20 px-6 flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-amber-400" />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No Data Available
          </h2>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Complete the carbon calculator first to receive personalized recommendations.
          </p>
          <Link to="/calculator">
            <button className="btn-eco flex items-center gap-2 mx-auto">
              <span className="relative z-10 flex items-center gap-2">
                <Calculator size={15} /> Go to Calculator
              </span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 pb-10 px-4 md:px-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">Personalized Eco Tips</p>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Recommendations
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Based on your carbon footprint data, here's how you can make the most impact.
          </p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Recommendations', value: recommendations.length, color: '#10b981', icon: Leaf },
            { label: 'High Impact Actions', value: highCount, color: '#ef4444', icon: AlertTriangle },
            { label: 'Potential CO₂ Savings', value: `${totalSavings.toFixed(1)} kg`, color: '#3b82f6', icon: TrendingDown },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label}
                className={`p-4 rounded-2xl text-center`}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                }}>
                <Icon size={18} style={{ color: s.color }} className="mx-auto mb-2" />
                <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
                <div className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Info banner */}
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 text-xs"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
          <Info size={14} className="shrink-0" />
          Recommendations are sorted by potential CO₂ reduction impact. Start with High Impact actions for maximum results.
        </div>

        {/* Recommendations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={rec.id} rec={rec} index={i} />
          ))}
        </div>

        {/* Progress tracker */}
        <div className={`mt-8 p-6 rounded-2xl`}
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}>
          <h3 className={`font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🎯 Potential Impact Summary
          </h3>
          <div className="space-y-3">
            {['transportation', 'energy', 'food', 'waste'].map((cat) => {
              const catRecs = recommendations.filter((r) => r.category === cat);
              const catSavings = catRecs.reduce((a, r) => a + (r.co2Savings || 0), 0);
              const meta = CATEGORY_META[cat];
              return catSavings > 0 ? (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'} style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                    <span className="font-semibold" style={{ color: meta.color }}>
                      −{catSavings.toFixed(1)} kg CO₂/day
                    </span>
                  </div>
                  <ProgressBar value={catSavings} max={totalSavings || 1} showLabel={false} color={meta.color} size="sm" />
                </div>
              ) : null;
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
