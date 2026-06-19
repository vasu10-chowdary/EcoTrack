import { Leaf, Globe, Share2, Mail, Heart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();
  const year = new Date().getFullYear();

  const links = [
    { label: 'Calculator', path: '/calculator' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Recommendations', path: '/recommendations' },
    { label: 'Challenges', path: '/challenges' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <footer className={`mt-auto border-t transition-colors duration-300
      ${isDark ? 'bg-gray-950/60 border-white/8' : 'bg-gray-50 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }}>
                <Leaf size={18} className="text-white" />
              </div>
              <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Eco<span className="gradient-text">Track</span>
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Empowering individuals to track and reduce their carbon footprint for a sustainable future.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Globe, Share2, Mail].map((Icon, i) => (
                <button key={i}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                    ${isDark ? 'bg-white/8 hover:bg-eco-500/20 text-gray-400 hover:text-eco-400' : 'bg-gray-200 hover:bg-eco-100 text-gray-500 hover:text-eco-600'}`}>
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className={`font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pages</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.path}>
                  <NavLink to={l.path}
                    className={`text-sm transition-colors duration-200
                      ${isDark ? 'text-gray-400 hover:text-eco-400' : 'text-gray-500 hover:text-eco-600'}`}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Impact stats */}
          <div>
            <h4 className={`font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Global Impact</h4>
            <div className="space-y-3">
              {[
                { label: 'Global CO₂ per capita', value: '4.7 t/yr' },
                { label: 'India CO₂ per capita', value: '1.9 t/yr' },
                { label: 'Daily average target', value: '12.9 kg/day' },
                { label: 'Trees per tonne CO₂', value: '~40 trees' },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</span>
                  <span className="text-xs font-semibold text-eco-400">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3
          ${isDark ? 'border-white/8' : 'border-gray-200'}`}>
          <p className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Made with <Heart size={11} className="text-rose-400 fill-rose-400" /> for the planet · © {year} EcoTrack
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            🌱 Every action counts. Start today.
          </p>
        </div>
      </div>
    </footer>
  );
}
