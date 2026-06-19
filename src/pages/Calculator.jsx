import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Car, Bus, Train, Bike, Plane, Zap, Flame, Droplets,
  UtensilsCrossed, Trash2, Recycle, ChevronDown, ChevronUp,
  Calculator as CalcIcon, RotateCcw, ArrowRight, Info
} from 'lucide-react';
import { EMISSION_FACTORS } from '../data/emissionFactors';
import { calculateCarbonEmissions } from '../utils/carbonCalculations';

const SECTIONS = ['transportation', 'energy', 'food', 'waste'];

const SECTION_META = {
  transportation: { label: 'Transportation', icon: Car, color: '#10b981', emoji: '🚗' },
  energy: { label: 'Home Energy', icon: Zap, color: '#3b82f6', emoji: '⚡' },
  food: { label: 'Food & Diet', icon: UtensilsCrossed, color: '#f59e0b', emoji: '🥗' },
  waste: { label: 'Waste Generation', icon: Trash2, color: '#ef4444', emoji: '♻️' },
};

const INITIAL_FORM = {
  transportation: { car: '', bus: '', train: '', bike: '', flight: '', motorcycle: '' },
  energy: { electricity: '', lpg: '', water: '' },
  food: { dietType: 'vegetarian', days: '1' },
  waste: { plastic: '', paper: '', organic: '', recyclingPercentage: '0' },
};

function InputField({ label, icon: Icon, value, onChange, unit, hint, min = 0 }) {
  const { isDark } = useTheme();
  return (
    <div>
      <label className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5
        ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {Icon && <Icon size={12} />} {label}
        {hint && (
          <span className="text-gray-500 font-normal normal-case ml-1">({hint})</span>
        )}
      </label>
      <div className="relative">
        <input
          type="number"
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className={`w-full rounded-xl px-4 py-2.5 text-sm pr-14 outline-none transition-all duration-200
            ${isDark
              ? 'bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-eco-500/50 focus:bg-white/8'
              : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-300 focus:border-eco-500 focus:ring-2 focus:ring-eco-500/10'
            }`}
        />
        {unit && (
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium
            ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function SectionCard({ section, isOpen, onToggle, children }) {
  const { isDark } = useTheme();
  const meta = SECTION_META[section];
  const Icon = meta.icon;

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-300
      ${isDark
        ? 'bg-white/4 border border-white/8'
        : 'bg-white border border-gray-200 shadow-sm'
      }`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-6 py-5 transition-all duration-200
          ${isOpen
            ? isDark ? 'bg-white/6' : 'bg-gray-50'
            : isDark ? 'hover:bg-white/6' : 'hover:bg-gray-50'
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}>
            <Icon size={18} style={{ color: meta.color }} />
          </div>
          <div className="text-left">
            <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {meta.emoji} {meta.label}
            </h3>
          </div>
        </div>
        {isOpen
          ? <ChevronUp size={18} className="text-gray-400" />
          : <ChevronDown size={18} className="text-gray-400" />
        }
      </button>
      {isOpen && (
        <div className={`px-6 pb-6 pt-4 border-t animate-fade-in
          ${isDark ? 'border-white/6' : 'border-gray-100'}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function Calculator() {
  const { isDark } = useTheme();
  const { submitCalculation } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [openSections, setOpenSections] = useState({ transportation: true, energy: false, food: false, waste: false });
  const [preview, setPreview] = useState(null);

  const update = (section, field, value) => {
    const updated = { ...form, [section]: { ...form[section], [field]: value } };
    setForm(updated);
    // Live preview
    try {
      const result = calculateCarbonEmissions(updated);
      setPreview(result);
    } catch (_) {}
  };

  const toggleSection = (s) => setOpenSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    submitCalculation(form);
    navigate('/dashboard');
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setPreview(null);
  };

  const totalLive = preview?.totalEmissions || 0;

  const DIET_OPTIONS = [
    { value: 'vegan', label: '🌱 Vegan', co2: '0.8 kg/day', color: '#10b981' },
    { value: 'vegetarian', label: '🥦 Vegetarian', co2: '1.0 kg/day', color: '#22c55e' },
    { value: 'eggetarian', label: '🥚 Eggetarian', co2: '1.5 kg/day', color: '#f59e0b' },
    { value: 'nonVegetarian', label: '🍗 Non-Vegetarian', co2: '3.0 kg/day', color: '#ef4444' },
  ];

  return (
    <div className={`min-h-screen pt-20 pb-10 px-4 md:px-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>
            <CalcIcon size={12} /> Carbon Footprint Calculator
          </div>
          <h1 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Calculate Your Emissions
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Enter your daily activities across all categories to get your personalized carbon footprint.
          </p>
        </div>

        {/* Live Preview Bar */}
        {totalLive > 0 && (
          <div className="mb-6 p-4 rounded-2xl flex items-center justify-between animate-slide-up"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(13,148,136,0.12))',
              border: '1px solid rgba(16,185,129,0.25)',
            }}>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Live Preview</p>
              <p className="text-2xl font-black text-eco-400">{totalLive.toFixed(2)} <span className="text-sm font-medium text-gray-400">kg CO₂</span></p>
            </div>
            <div className="flex gap-3 text-xs">
              {preview?.breakdown && Object.entries(preview.breakdown).map(([k, v]) => (
                v > 0 && (
                  <div key={k} className="text-center">
                    <div className="font-bold" style={{ color: SECTION_META[k]?.color }}>{v.toFixed(1)}</div>
                    <div className="text-gray-500 capitalize">{k.slice(0, 4)}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Transportation ── */}
          <SectionCard section="transportation" isOpen={openSections.transportation} onToggle={() => toggleSection('transportation')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Car" icon={Car} value={form.transportation.car} onChange={(v) => update('transportation', 'car', v)} unit="km" hint={`${EMISSION_FACTORS.transportation.car} kg/km`} />
              <InputField label="Motorcycle" value={form.transportation.motorcycle} onChange={(v) => update('transportation', 'motorcycle', v)} unit="km" hint={`${EMISSION_FACTORS.transportation.motorcycle} kg/km`} />
              <InputField label="Bus" icon={Bus} value={form.transportation.bus} onChange={(v) => update('transportation', 'bus', v)} unit="km" hint={`${EMISSION_FACTORS.transportation.bus} kg/km`} />
              <InputField label="Train" icon={Train} value={form.transportation.train} onChange={(v) => update('transportation', 'train', v)} unit="km" hint={`${EMISSION_FACTORS.transportation.train} kg/km`} />
              <InputField label="Bicycle" icon={Bike} value={form.transportation.bike} onChange={(v) => update('transportation', 'bike', v)} unit="km" hint="0 kg/km 🌿" />
              <InputField label="Flight" icon={Plane} value={form.transportation.flight} onChange={(v) => update('transportation', 'flight', v)} unit="km" hint={`${EMISSION_FACTORS.transportation.flight} kg/km`} />
            </div>
          </SectionCard>

          {/* ── Energy ── */}
          <SectionCard section="energy" isOpen={openSections.energy} onToggle={() => toggleSection('energy')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Electricity" icon={Zap} value={form.energy.electricity} onChange={(v) => update('energy', 'electricity', v)} unit="kWh" hint={`${EMISSION_FACTORS.energy.electricity} kg/kWh`} />
              <InputField label="LPG Usage" icon={Flame} value={form.energy.lpg} onChange={(v) => update('energy', 'lpg', v)} unit="kg" hint={`${EMISSION_FACTORS.energy.lpg} kg/kg`} />
              <InputField label="Water Consumption" icon={Droplets} value={form.energy.water} onChange={(v) => update('energy', 'water', v)} unit="L" hint={`${EMISSION_FACTORS.energy.water} kg/L`} />
            </div>
          </SectionCard>

          {/* ── Food ── */}
          <SectionCard section="food" isOpen={openSections.food} onToggle={() => toggleSection('food')}>
            <div className="space-y-5">
              <div>
                <label className={`text-xs font-semibold mb-3 block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Diet Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {DIET_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('food', 'dietType', opt.value)}
                      className={`p-3 rounded-xl text-sm font-medium text-left transition-all duration-200 border`}
                      style={{
                        background: form.food.dietType === opt.value ? `${opt.color}18` : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                        borderColor: form.food.dietType === opt.value ? `${opt.color}50` : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                        color: form.food.dietType === opt.value ? opt.color : isDark ? '#94a3b8' : '#64748b',
                        transform: form.food.dietType === opt.value ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      <div className="font-semibold mb-0.5">{opt.label}</div>
                      <div className="text-xs opacity-70">{opt.co2}</div>
                    </button>
                  ))}
                </div>
              </div>
              <InputField label="Days (for calculation)" value={form.food.days} onChange={(v) => update('food', 'days', v)} unit="days" min={1} />
            </div>
          </SectionCard>

          {/* ── Waste ── */}
          <SectionCard section="waste" isOpen={openSections.waste} onToggle={() => toggleSection('waste')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Plastic Waste" icon={Trash2} value={form.waste.plastic} onChange={(v) => update('waste', 'plastic', v)} unit="kg" hint={`${EMISSION_FACTORS.waste.plastic} kg/kg`} />
              <InputField label="Paper Waste" value={form.waste.paper} onChange={(v) => update('waste', 'paper', v)} unit="kg" hint={`${EMISSION_FACTORS.waste.paper} kg/kg`} />
              <InputField label="Organic Waste" value={form.waste.organic} onChange={(v) => update('waste', 'organic', v)} unit="kg" hint={`${EMISSION_FACTORS.waste.organic} kg/kg`} />
              <div>
                <label className={`text-xs font-semibold mb-1.5 flex items-center gap-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Recycle size={12} /> Recycling Rate
                </label>
                <div className="relative">
                  <input
                    type="range" min="0" max="100" step="5"
                    value={form.waste.recyclingPercentage}
                    onChange={(e) => update('waste', 'recyclingPercentage', e.target.value)}
                    className="w-full accent-eco-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>0%</span>
                    <span className="font-bold text-eco-400">{form.waste.recyclingPercentage}%</span>
                    <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Formula Reference */}
          <div className={`p-4 rounded-2xl text-xs ${isDark ? 'bg-white/4 border border-white/8' : 'bg-blue-50 border border-blue-100'}`}>
            <div className="flex items-center gap-2 mb-2 font-semibold" style={{ color: '#3b82f6' }}>
              <Info size={13} /> Emission Factors Reference
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {[
                'Car: 0.12 kg/km', 'Bus: 0.05 kg/km', 'Train: 0.03 kg/km', 'Flight: 0.25 kg/km',
                'Electricity: 0.82 kg/kWh', 'LPG: 2.98 kg/kg', 'Vegan: 0.8 kg/day', 'Non-Veg: 3.0 kg/day',
              ].map((f) => (
                <div key={f} className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-eco-400 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleReset}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border
                ${isDark ? 'border-white/10 text-gray-400 hover:bg-white/6' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
              <RotateCcw size={15} /> Reset
            </button>
            <button type="submit"
              className="flex-1 btn-eco text-sm flex items-center justify-center gap-2">
              <span className="relative z-10 flex items-center gap-2">
                <CalcIcon size={16} />
                Calculate & View Dashboard
                <ArrowRight size={15} />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
