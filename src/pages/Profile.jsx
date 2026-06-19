import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { CHALLENGES, BADGES } from '../data/challenges';
import { getSustainabilityLevel } from '../utils/carbonCalculations';
import ProgressBar from '../components/ui/ProgressBar';
import {
  User, Leaf, Trophy, Zap, Star, TrendingDown, Calendar,
  Edit2, Check, X, RotateCcw, AlertTriangle
} from 'lucide-react';

const AVATAR_OPTIONS = ['🌱', '🌿', '🍃', '🌳', '🌲', '🌊', '⚡', '☀️', '🦋', '🐝', '🌻', '🦜'];

export default function Profile() {
  const { isDark } = useTheme();
  const {
    userName, userAvatar, emissions, sustainabilityScore,
    completedChallenges, totalPoints, totalCo2Saved,
    history, updateProfile, resetData
  } = useApp();

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [selectedAvatar, setSelectedAvatar] = useState(userAvatar);

  const level = getSustainabilityLevel(sustainabilityScore);

  const allChallenges = [...(CHALLENGES.daily || []), ...(CHALLENGES.weekly || [])];
  const completedCount = completedChallenges.length;

  // Earned badges
  const earnedBadges = BADGES.filter((b) => {
    if (b.type === 'co2') return totalCo2Saved >= b.requirement;
    if (b.category) return completedChallenges.filter((id) => {
      const ch = allChallenges.find((c) => c.id === id);
      return ch?.category === b.category;
    }).length >= b.requirement;
    return completedCount >= b.requirement;
  });

  const handleSave = () => {
    updateProfile({ userName: nameInput, userAvatar: selectedAvatar });
    setEditing(false);
  };

  const handleCancel = () => {
    setNameInput(userName);
    setSelectedAvatar(userAvatar);
    setEditing(false);
  };

  // XP level calculation
  const xpLevel = Math.floor(totalPoints / 200) + 1;
  const xpProgress = ((totalPoints % 200) / 200) * 100;

  return (
    <div className={`min-h-screen pt-20 pb-10 px-4 md:px-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">Your Profile</p>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Eco Warrior Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Profile Card ── */}
          <div className={`lg:col-span-1 p-6 rounded-2xl`}
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.95)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
            }}>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
                  style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(13,148,136,0.2))', border: '2px solid rgba(16,185,129,0.3)' }}>
                  {editing ? selectedAvatar : userAvatar}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }}>
                  {level.emoji}
                </div>
              </div>

              {editing ? (
                <>
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className={`text-center font-bold text-lg w-full rounded-xl px-3 py-2 mb-4 outline-none border transition-all
                      ${isDark ? 'bg-white/8 border-white/15 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                    maxLength={24}
                  />
                  {/* Avatar picker */}
                  <div className="grid grid-cols-6 gap-1.5 mb-4 w-full">
                    {AVATAR_OPTIONS.map((av) => (
                      <button key={av}
                        onClick={() => setSelectedAvatar(av)}
                        className={`text-xl p-1.5 rounded-lg transition-all duration-150 hover:scale-110`}
                        style={{
                          background: selectedAvatar === av
                            ? 'rgba(16,185,129,0.2)' : 'transparent',
                          border: selectedAvatar === av
                            ? '1px solid rgba(16,185,129,0.4)' : '1px solid transparent',
                        }}>
                        {av}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 w-full">
                    <button onClick={handleCancel}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all
                        ${isDark ? 'border-white/10 text-gray-400 hover:bg-white/6' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <X size={12} className="inline mr-1" /> Cancel
                    </button>
                    <button onClick={handleSave}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }}>
                      <Check size={12} className="inline mr-1" /> Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userName}</h2>
                  <p className="text-sm font-semibold mb-4" style={{ color: level.color }}>{level.label} Eco Warrior</p>
                  <button onClick={() => setEditing(true)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border
                      ${isDark ? 'border-white/10 text-gray-400 hover:bg-white/8' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    <Edit2 size={12} /> Edit Profile
                  </button>
                </>
              )}
            </div>

            {/* XP Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Level {xpLevel} Eco Warrior</span>
                <span className="font-bold text-eco-400">{totalPoints} XP</span>
              </div>
              <ProgressBar value={xpProgress} max={100} showLabel={false} color="#10b981" size="md" />
              <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                {200 - (totalPoints % 200)} XP to Level {xpLevel + 1}
              </p>
            </div>

            {/* Mini stats */}
            <div className="space-y-3 pt-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
              {[
                { icon: Trophy, label: 'Challenges Done', value: completedCount, color: '#f59e0b' },
                { icon: Star, label: 'Badges Earned', value: earnedBadges.length, color: '#8b5cf6' },
                { icon: Leaf, label: 'CO₂ Saved (kg)', value: totalCo2Saved.toFixed(1), color: '#10b981' },
                { icon: Zap, label: 'Total Points', value: totalPoints, color: '#3b82f6' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={14} style={{ color: s.color }} />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                );
              })}
            </div>

            {/* Reset */}
            <button
              onClick={() => { if (window.confirm('Reset all data? This cannot be undone.')) resetData(); }}
              className={`mt-5 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all
                ${isDark ? 'border-red-500/20 text-red-400 hover:bg-red-500/8' : 'border-red-200 text-red-500 hover:bg-red-50'}`}>
              <RotateCcw size={11} /> Reset All Data
            </button>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Emissions summary */}
            <div className={`p-5 rounded-2xl`}
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.95)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}>
              <h3 className={`font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📊 Latest Carbon Footprint
              </h3>
              {emissions ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total', value: `${emissions.totalEmissions} kg`, color: '#10b981' },
                    { label: 'Transport', value: `${emissions.breakdown.transportation} kg`, color: '#10b981' },
                    { label: 'Energy', value: `${emissions.breakdown.energy} kg`, color: '#3b82f6' },
                    { label: 'Food', value: `${emissions.breakdown.food} kg`, color: '#f59e0b' },
                  ].map((s) => (
                    <div key={s.label} className={`p-3 rounded-xl text-center ${isDark ? 'bg-white/4' : 'bg-gray-50'}`}>
                      <div className="font-black text-base" style={{ color: s.color }}>{s.value}</div>
                      <div className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-sm text-center py-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <AlertTriangle size={16} className="inline mr-2 text-amber-400" />
                  No calculation yet
                </div>
              )}
            </div>

            {/* Badges */}
            <div className={`p-5 rounded-2xl`}
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.95)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}>
              <h3 className={`font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🏆 Earned Badges
              </h3>
              {earnedBadges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {earnedBadges.map((badge) => (
                    <div key={badge.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <span className="text-lg">{badge.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-eco-400">{badge.name}</div>
                        <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Complete challenges to earn badges! 🎯
                </p>
              )}
            </div>

            {/* Calculation history */}
            <div className={`p-5 rounded-2xl`}
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.95)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}>
              <h3 className={`font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📅 Carbon History (Recent)
              </h3>
              {history.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                  {history.slice(0, 10).map((entry, i) => {
                    const entryLevel = getSustainabilityLevel(entry.score);
                    return (
                      <div key={entry.id}
                        className={`flex items-center justify-between p-3 rounded-xl text-xs
                          ${isDark ? 'bg-white/4 hover:bg-white/6' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-gray-500" />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{entry.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-eco-400">{entry.total} kg</span>
                          <span className="font-semibold" style={{ color: entryLevel.color }}>
                            {entry.score}/100
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  No history yet. Calculate your footprint to see your progress.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
