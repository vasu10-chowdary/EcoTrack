import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import EmissionPieChart from '../components/charts/EmissionPieChart';
import WeeklyLineChart from '../components/charts/WeeklyLineChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import CarbonGauge from '../components/charts/CarbonGauge';
import ProgressBar from '../components/ui/ProgressBar';
import { exportDashboardPDF } from '../utils/pdfExport';
import { getSustainabilityLevel } from '../utils/carbonCalculations';
import { DAILY_AVERAGE_CO2 } from '../data/emissionFactors';
import {
  Download, Calculator, Leaf, Car, Zap, UtensilsCrossed, Trash2,
  TrendingDown, Target, AlertCircle, BarChart2, Activity
} from 'lucide-react';

function ChartCard({ title, subtitle, children, className = '' }) {
  const { isDark } = useTheme();
  return (
    <div className={`rounded-2xl p-6 ${className}`}
      style={{
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.06)',
      }}>
      <div className="mb-5">
        <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        {subtitle && <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function EmptyState() {
  const { isDark } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-eco-500/10 flex items-center justify-center mb-5">
        <BarChart2 size={36} className="text-eco-400" />
      </div>
      <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Data Yet</h2>
      <p className={`text-sm mb-6 max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Calculate your carbon footprint first to see your personalized dashboard.
      </p>
      <Link to="/calculator">
        <button className="btn-eco flex items-center gap-2">
          <span className="relative z-10 flex items-center gap-2">
            <Calculator size={16} /> Go to Calculator
          </span>
        </button>
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const { isDark } = useTheme();
  const { emissions, sustainabilityScore, weeklyData, monthlyData, userName } = useApp();

  if (!emissions) return (
    <div className={`min-h-screen pt-20 px-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <EmptyState />
      </div>
    </div>
  );

  const { totalEmissions, breakdown } = emissions;
  const level = getSustainabilityLevel(sustainabilityScore);
  const avgDaily = DAILY_AVERAGE_CO2;
  const goalKg = 8; // target daily kg

  const categoryCards = [
    { label: 'Transportation', value: breakdown.transportation, icon: '🚗', color: '#10b981', gradient: 'linear-gradient(135deg, #16a34a, #0d9488)', unit: 'kg CO₂' },
    { label: 'Home Energy', value: breakdown.energy, icon: '⚡', color: '#3b82f6', gradient: 'linear-gradient(135deg, #1d4ed8, #0891b2)', unit: 'kg CO₂' },
    { label: 'Food & Diet', value: breakdown.food, icon: '🥗', color: '#f59e0b', gradient: 'linear-gradient(135deg, #d97706, #ea580c)', unit: 'kg CO₂' },
    { label: 'Waste', value: breakdown.waste, icon: '♻️', color: '#ef4444', gradient: 'linear-gradient(135deg, #dc2626, #9333ea)', unit: 'kg CO₂' },
  ];

  const handleExportPDF = async () => {
    try {
      await exportDashboardPDF(emissions, sustainabilityScore, userName);
    } catch (e) {
      console.error('PDF export error', e);
    }
  };

  return (
    <div className={`min-h-screen pt-20 pb-10 px-4 md:px-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="section-label mb-1">Your Carbon Dashboard</p>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Sustainability Overview
            </h1>
          </div>
          <button onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(13,148,136,0.15))',
              border: '1px solid rgba(16,185,129,0.3)',
              color: '#10b981',
            }}>
            <Download size={15} /> Export PDF
          </button>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon="🌍"
            label="Total CO₂ Emissions"
            value={totalEmissions}
            unit="kg"
            color="#10b981"
            gradient="linear-gradient(135deg, #16a34a, #0d9488)"
            trend={totalEmissions < avgDaily ? 'down' : 'up'}
            trendValue={totalEmissions < avgDaily ? 'Below avg' : 'Above avg'}
            delay={0}
          />
          <StatCard
            icon="📊"
            label="Daily Carbon Score"
            value={sustainabilityScore}
            unit="/100"
            color={level.color}
            gradient={`linear-gradient(135deg, ${level.color}, ${level.color}88)`}
            delay={100}
          />
          <StatCard
            icon="🚗"
            label="Transport Impact"
            value={breakdown.transportation}
            unit="kg"
            color="#10b981"
            gradient="linear-gradient(135deg, #16a34a, #0d9488)"
            delay={200}
          />
          <StatCard
            icon="⚡"
            label="Energy Impact"
            value={breakdown.energy}
            unit="kg"
            color="#3b82f6"
            gradient="linear-gradient(135deg, #1d4ed8, #0891b2)"
            delay={300}
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

          {/* Gauge + Progress */}
          <ChartCard title="Carbon Score" subtitle="Your sustainability rating">
            <CarbonGauge score={sustainabilityScore} />
            <div className="mt-4 space-y-3">
              <ProgressBar
                value={totalEmissions}
                max={avgDaily * 2}
                label="vs. Global Average"
                color={totalEmissions < avgDaily ? '#10b981' : '#ef4444'}
              />
              <ProgressBar
                value={Math.max(0, goalKg - totalEmissions)}
                max={goalKg}
                label="Progress to 8 kg/day Goal"
                color="#3b82f6"
              />
            </div>
          </ChartCard>

          {/* Pie chart */}
          <ChartCard title="Emission Breakdown" subtitle="By category" className="lg:col-span-2">
            <EmissionPieChart breakdown={breakdown} />
          </ChartCard>
        </div>

        {/* Category detail cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {categoryCards.map((cat, i) => {
            const pct = totalEmissions > 0 ? (cat.value / totalEmissions) * 100 : 0;
            return (
              <div key={cat.label}
                className={`p-4 rounded-2xl animate-fade-in`}
                style={{
                  animationDelay: `${i * 80}ms`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                }}>
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="font-black text-xl mb-0.5" style={{ color: cat.color }}>
                  {cat.value.toFixed(1)}
                  <span className={`text-xs font-medium ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>kg</span>
                </div>
                <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{cat.label}</div>
                <ProgressBar value={pct} max={100} showLabel={false} color={cat.color} size="sm" />
                <div className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{pct.toFixed(0)}% of total</div>
              </div>
            );
          })}
        </div>

        {/* Chart row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <ChartCard title="Weekly Trend" subtitle="Last 7 days emissions">
            <WeeklyLineChart data={weeklyData} />
          </ChartCard>
          <ChartCard title="Monthly Overview" subtitle="Last 6 months">
            <MonthlyBarChart data={monthlyData} />
          </ChartCard>
        </div>

        {/* Carbon goal widget */}
        <div className={`p-6 rounded-2xl`}
          style={{
            background: totalEmissions <= goalKg
              ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(13,148,136,0.1))'
              : 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(245,158,11,0.08))',
            border: `1px solid ${totalEmissions <= goalKg ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`,
          }}>
          <div className="flex items-start gap-4 flex-wrap">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0`}
              style={{ background: totalEmissions <= goalKg ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)' }}>
              {totalEmissions <= goalKg
                ? <Leaf size={22} className="text-eco-400" />
                : <AlertCircle size={22} className="text-red-400" />
              }
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {totalEmissions <= goalKg ? '🎉 Goal Achieved!' : '🎯 Carbon Reduction Goal'}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {totalEmissions <= goalKg
                  ? `Amazing! Your ${totalEmissions.toFixed(1)} kg/day is below the 8 kg/day sustainability goal.`
                  : `You're ${(totalEmissions - goalKg).toFixed(1)} kg above your daily goal of 8 kg CO₂. Check recommendations to improve.`
                }
              </p>
            </div>
            <Link to="/recommendations">
              <button className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                ${isDark ? 'bg-white/8 hover:bg-white/15 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'}`}>
                View Tips →
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
