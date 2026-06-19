import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import {
  Leaf, LayoutDashboard, Calculator, Lightbulb, Trophy, User,
  Sun, Moon, Menu, X, Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Leaf },
  { path: '/calculator', label: 'Calculator', icon: Calculator },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/recommendations', label: 'Tips', icon: Lightbulb },
  { path: '/challenges', label: 'Challenges', icon: Trophy },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { sustainabilityScore, totalPoints } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-4 md:px-8
        backdrop-blur-xl border-b transition-colors duration-300
        ${isDark
          ? 'bg-gray-950/80 border-white/8'
          : 'bg-white/80 border-gray-200/60'
        }`}
      >
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 mr-8 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }}>
            <Leaf size={16} className="text-white" />
          </div>
          <span className={`font-bold text-lg hidden sm:block ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Eco<span className="gradient-text">Track</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(path);
            return (
              <NavLink
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? isDark ? 'text-eco-400 bg-eco-500/10' : 'text-eco-600 bg-eco-50'
                    : isDark ? 'text-gray-400 hover:text-white hover:bg-white/8' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Icon size={15} />
                {label}
              </NavLink>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Points badge */}
          {totalPoints > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(13,148,136,0.15))', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Zap size={12} className="text-eco-400" />
              <span className="text-eco-400">{totalPoints} pts</span>
            </div>
          )}

          {/* Score badge */}
          {sustainabilityScore > 0 && (
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
              ${sustainabilityScore >= 60
                ? 'bg-eco-500/10 border border-eco-500/25 text-eco-400'
                : 'bg-amber-500/10 border border-amber-500/25 text-amber-400'
              }`}>
              Score: {sustainabilityScore}
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
              ${isDark ? 'bg-white/8 hover:bg-white/15 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
              ${isDark ? 'bg-white/8 hover:bg-white/15 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div
          className={`fixed inset-0 z-30 md:hidden`}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className={`absolute top-16 left-0 right-0 p-4 flex flex-col gap-1 backdrop-blur-xl border-b
              ${isDark ? 'bg-gray-950/95 border-white/8' : 'bg-white/95 border-gray-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(path);
              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? isDark ? 'text-eco-400 bg-eco-500/10' : 'text-eco-600 bg-eco-50'
                      : isDark ? 'text-gray-400 hover:text-white hover:bg-white/8' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
