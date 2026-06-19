import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import {
  Leaf, Calculator, LayoutDashboard, Lightbulb, Trophy, Shield,
  TrendingDown, Globe, Zap, ArrowRight, ChevronDown, BarChart2,
  Users, Award, Activity
} from 'lucide-react';

function AnimatedStat({ value, suffix, label, color, decimals = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const count = useAnimatedCounter(visible ? value : 0, 2000, decimals);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black tabular-nums mb-2" style={{ color }}>
        {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}{suffix}
      </div>
      <div className="text-sm text-gray-400 font-medium">{label}</div>
    </div>
  );
}

const FEATURES = [
  { icon: Calculator, title: 'Carbon Calculator', desc: 'Calculate your daily carbon footprint across transport, energy, food, and waste.', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { icon: LayoutDashboard, title: 'Smart Dashboard', desc: 'Visualize your emissions with interactive charts and real-time sustainability scores.', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { icon: Lightbulb, title: 'AI Recommendations', desc: 'Get personalized, data-driven tips to reduce your specific environmental impact.', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { icon: Trophy, title: 'Eco Challenges', desc: 'Complete daily and weekly sustainability challenges to earn badges and points.', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { icon: BarChart2, title: 'Progress Tracking', desc: 'Monitor your carbon reduction journey with weekly and monthly trend analysis.', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  { icon: Shield, title: 'AI Eco Assistant', desc: 'Chat with EcoBot for instant answers to all your sustainability questions.', color: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
];

const BENEFITS = [
  { icon: Globe, title: 'Environmental Awareness', desc: 'Understand exactly how your daily habits contribute to climate change.' },
  { icon: TrendingDown, title: 'Reduce Your Impact', desc: 'Make informed choices backed by real emission data and science.' },
  { icon: Zap, title: 'Save Money Too', desc: 'Eco-friendly habits often lead to significant cost savings on energy and transport.' },
  { icon: Users, title: 'Join the Movement', desc: 'Be part of a global community committed to a sustainable future.' },
];

export default function Landing() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0"
            style={{ background: isDark
              ? 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(22,163,74,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(13,148,136,0.12) 0%, transparent 50%)'
              : 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(22,163,74,0.08) 0%, transparent 60%)'
            }}
          />
          {/* Floating orbs */}
          <div className="orb orb-green w-96 h-96 -top-20 -left-20 opacity-10" />
          <div className="orb orb-blue w-80 h-80 -bottom-20 -right-20 opacity-10" style={{ animationDelay: '-3s' }} />
          <div className="orb orb-teal w-64 h-64 top-1/2 -left-10 opacity-8" style={{ animationDelay: '-6s' }} />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 animate-fade-in"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              color: '#10b981',
            }}>
            <Leaf size={12} />
            Carbon Footprint Awareness Platform
            <Activity size={12} className="animate-pulse-slow" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 animate-fade-in"
            style={{ animationDelay: '100ms' }}>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Track & Reduce</span>
            <br />
            <span className="gradient-text">Your Carbon</span>
            <br />
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Footprint</span>
          </h1>

          {/* Subtitle */}
          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in
            ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            style={{ animationDelay: '200ms' }}>
            Make data-driven decisions to reduce your environmental impact. Track emissions,
            complete sustainability challenges, and get personalized eco tips — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: '300ms' }}>
            <Link to="/calculator">
              <button className="btn-eco flex items-center gap-2.5 text-base px-8 py-4">
                <span className="relative z-10 flex items-center gap-2.5">
                  <Calculator size={18} />
                  Calculate My Footprint
                  <ArrowRight size={16} />
                </span>
              </button>
            </Link>
            <Link to="/dashboard">
              <button className={`flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300
                border hover:-translate-y-0.5
                ${isDark
                  ? 'border-white/15 text-white hover:bg-white/8'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                <LayoutDashboard size={18} />
                View Dashboard
              </button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 animate-bounce-soft">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Explore features</span>
            <ChevronDown size={20} className="text-eco-500" />
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className={`py-20 ${isDark ? 'bg-gray-900/40' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Global Climate Data</p>
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              The Numbers That Matter
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <AnimatedStat value={37} suffix="B" label="Global CO₂ tonnes/year" color="#ef4444" />
            <AnimatedStat value={4.7} suffix="t" label="CO₂ per person annually" color="#f59e0b" decimals={1} />
            <AnimatedStat value={1.5} suffix="°C" label="Paris Agreement target" color="#3b82f6" decimals={1} />
            <AnimatedStat value={45} suffix="%" label="Emissions to cut by 2030" color="#10b981" />
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Platform Features</p>
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Everything You Need to Go Green
            </h2>
            <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              A complete sustainability platform built to make eco-friendly living easy, engaging, and data-driven.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover cursor-default animate-fade-in`}
                  style={{
                    animationDelay: `${i * 80}ms`,
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.06)',
                  }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: f.bg }}>
                    <Icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className={`font-bold text-base mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Benefits Section ── */}
      <section className={`py-20 px-6 ${isDark ? 'bg-gray-900/40' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="section-label mb-3">Why EcoTrack?</p>
              <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your Personal Path to a Greener Future
              </h2>
              <p className={`text-base leading-relaxed mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                EcoTrack combines powerful analytics with behavioral science to help you build sustainable habits
                that stick — and actually make a difference.
              </p>
              <Link to="/calculator">
                <button className="btn-eco flex items-center gap-2">
                  <span className="relative z-10 flex items-center gap-2">
                    <Leaf size={16} />
                    Start Your Green Journey
                    <ArrowRight size={15} />
                  </span>
                </button>
              </Link>
            </div>

            {/* Right */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={b.title}
                    className={`p-5 rounded-2xl animate-fade-in`}
                    style={{
                      animationDelay: `${i * 100}ms`,
                      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                    }}>
                    <div className="w-10 h-10 rounded-xl bg-eco-500/10 flex items-center justify-center mb-3">
                      <Icon size={18} className="text-eco-400" />
                    </div>
                    <h3 className={`font-bold text-sm mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{b.title}</h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(13,148,136,0.15))', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="orb orb-green w-64 h-64 -top-10 -right-10 opacity-20" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-eco-500/20 flex items-center justify-center mx-auto mb-6">
                <Award size={32} className="text-eco-400" />
              </div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Ready to Make a Difference?
              </h2>
              <p className={`text-base mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Join thousands of eco-conscious individuals tracking their carbon footprint with EcoTrack.
                Every small action adds up to a big impact.
              </p>
              <Link to="/calculator">
                <button className="btn-eco text-base px-10 py-4">
                  <span className="relative z-10 flex items-center gap-2.5">
                    <Calculator size={18} />
                    Get Started — It's Free
                    <ArrowRight size={16} />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
