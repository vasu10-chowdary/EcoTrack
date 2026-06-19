import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { CHALLENGES, BADGES } from '../data/challenges';
import ProgressBar from '../components/ui/ProgressBar';
import { Trophy, Star, CheckCircle, Circle, Zap, Clock, Award, Lock } from 'lucide-react';

const DIFFICULTY_META = {
  easy: { label: 'Easy', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  hard: { label: 'Hard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const CATEGORY_META = {
  transportation: { color: '#10b981' },
  energy: { color: '#3b82f6' },
  food: { color: '#f59e0b' },
  waste: { color: '#ef4444' },
};

function ChallengeCard({ challenge, isCompleted, onComplete, type }) {
  const { isDark } = useTheme();
  const diff = DIFFICULTY_META[challenge.difficulty];
  const cat = CATEGORY_META[challenge.category] || { color: '#8b5cf6' };

  return (
    <div
      className={`p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden`}
      style={{
        background: isCompleted
          ? isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)'
          : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.95)',
        border: isCompleted
          ? '1px solid rgba(16,185,129,0.3)'
          : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.05)',
        opacity: isCompleted ? 0.9 : 1,
      }}
    >
      {/* Completed checkmark overlay */}
      {isCompleted && (
        <div className="absolute top-3 right-3">
          <CheckCircle size={20} className="text-eco-400" />
        </div>
      )}

      {/* Icon + title */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{challenge.icon}</span>
        <div className="flex-1">
          <h3 className={`font-bold text-sm leading-tight mb-1 ${isCompleted ? 'text-eco-400' : isDark ? 'text-white' : 'text-gray-900'}`}>
            {challenge.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: diff.bg, color: diff.color }}>
              {diff.label}
            </span>
            {type === 'weekly' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                {challenge.duration} days
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {challenge.description}
      </p>

      {/* Stats row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-eco-400 font-semibold">
            <span>🌿</span> -{challenge.co2Saved} kg CO₂
          </div>
          <div className="flex items-center gap-1 font-semibold" style={{ color: '#f59e0b' }}>
            <Zap size={11} /> +{challenge.points} pts
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={() => !isCompleted && onComplete(challenge)}
        disabled={isCompleted}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2
          ${isCompleted
            ? isDark ? 'bg-eco-500/15 text-eco-400 cursor-default' : 'bg-eco-50 text-eco-600 cursor-default'
            : 'cursor-pointer hover:-translate-y-0.5 text-white'
          }`}
        style={!isCompleted ? { background: 'linear-gradient(135deg, #16a34a, #0d9488)' } : {}}
      >
        {isCompleted ? (
          <><CheckCircle size={13} /> Completed!</>
        ) : (
          <><Circle size={13} /> Mark Complete</>
        )}
      </button>
    </div>
  );
}

function BadgeCard({ badge, earned }) {
  const { isDark } = useTheme();
  return (
    <div
      className={`p-4 rounded-2xl text-center transition-all duration-300 hover:-translate-y-0.5`}
      style={{
        background: earned
          ? isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)'
          : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        border: earned
          ? '1px solid rgba(16,185,129,0.3)'
          : isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
        opacity: earned ? 1 : 0.5,
      }}
    >
      <div className={`text-3xl mb-2 ${!earned ? 'grayscale' : ''}`} style={{ filter: !earned ? 'grayscale(1)' : 'none' }}>
        {earned ? badge.icon : <Lock size={20} className="mx-auto text-gray-500" />}
      </div>
      <h4 className={`text-xs font-bold mb-1 ${earned ? isDark ? 'text-eco-400' : 'text-eco-600' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {badge.name}
      </h4>
      <p className={`text-[10px] leading-tight ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        {badge.description}
      </p>
    </div>
  );
}

export default function Challenges() {
  const { isDark } = useTheme();
  const { completedChallenges, totalPoints, totalCo2Saved, completeChallenge } = useApp();
  const [tab, setTab] = useState('daily');

  const allCompleted = [...(CHALLENGES.daily || []), ...(CHALLENGES.weekly || [])];
  const completedCount = completedChallenges.length;

  // Badge logic
  const earnedBadgeIds = BADGES
    .filter((b) => {
      if (b.type === 'co2') return totalCo2Saved >= b.requirement;
      if (b.category) return completedChallenges.filter((id) => {
        const ch = allCompleted.find((c) => c.id === id);
        return ch?.category === b.category;
      }).length >= b.requirement;
      return completedCount >= b.requirement;
    })
    .map((b) => b.id);

  const tabChallenges = tab === 'daily' ? CHALLENGES.daily : CHALLENGES.weekly;

  return (
    <div className={`min-h-screen pt-20 pb-10 px-4 md:px-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">Eco Challenges</p>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sustainability Challenges
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Complete challenges to earn points, badges, and build lasting eco habits.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Trophy, label: 'Completed', value: completedCount, color: '#f59e0b' },
            { icon: Zap, label: 'Total Points', value: totalPoints, color: '#8b5cf6' },
            { icon: Star, label: 'CO₂ Saved (kg)', value: totalCo2Saved.toFixed(1), color: '#10b981' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label}
                className={`p-4 rounded-2xl text-center`}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                }}>
                <Icon size={20} style={{ color: s.color }} className="mx-auto mb-2" />
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                <div className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Overall progress */}
        <div className="mb-8">
          <ProgressBar
            value={completedCount}
            max={allCompleted.length}
            label={`Overall Progress (${completedCount}/${allCompleted.length} challenges)`}
            color="#10b981"
            size="lg"
          />
        </div>

        {/* Tab selector */}
        <div className={`flex gap-1 p-1 rounded-2xl mb-6 w-fit`}
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
          {['daily', 'weekly'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 capitalize`}
              style={{
                background: tab === t ? 'linear-gradient(135deg, #16a34a, #0d9488)' : 'transparent',
                color: tab === t ? 'white' : isDark ? '#94a3b8' : '#64748b',
              }}
            >
              {t === 'daily' ? '☀️' : '📅'} {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Challenges grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {tabChallenges.map((ch) => (
            <ChallengeCard
              key={ch.id}
              challenge={ch}
              isCompleted={completedChallenges.includes(ch.id)}
              onComplete={completeChallenge}
              type={tab}
            />
          ))}
        </div>

        {/* Badges section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Award size={20} className="text-eco-400" />
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Achievement Badges
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
              {earnedBadgeIds.length}/{BADGES.length} Earned
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BADGES.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned={earnedBadgeIds.includes(badge.id)} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
