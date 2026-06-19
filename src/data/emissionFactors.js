// Emission factors (kg CO₂ per unit)
export const EMISSION_FACTORS = {
  transportation: {
    car: 0.12,        // per km
    bus: 0.05,        // per km
    train: 0.03,      // per km
    bike: 0,          // per km (zero emission)
    flight: 0.25,     // per km
    motorcycle: 0.08, // per km
  },
  energy: {
    electricity: 0.82,  // per kWh
    lpg: 2.98,          // per kg
    water: 0.001,       // per liter
    naturalGas: 2.04,   // per m³
  },
  food: {
    vegan: 0.8,           // kg CO₂ per day
    vegetarian: 1.0,      // kg CO₂ per day
    eggetarian: 1.5,      // kg CO₂ per day
    nonVegetarian: 3.0,   // kg CO₂ per day
  },
  waste: {
    plastic: 0.4,   // per kg
    paper: 0.1,     // per kg
    organic: 0.05,  // per kg
    glass: 0.02,    // per kg
  },
};

export const CATEGORY_COLORS = {
  transportation: '#10b981',
  energy: '#3b82f6',
  food: '#f59e0b',
  waste: '#ef4444',
};

export const CATEGORY_ICONS = {
  transportation: '🚗',
  energy: '⚡',
  food: '🥗',
  waste: '♻️',
};

export const GLOBAL_AVERAGE_CO2 = 4.7; // tonnes per year
export const DAILY_AVERAGE_CO2 = (GLOBAL_AVERAGE_CO2 * 1000) / 365; // kg per day ≈ 12.88
export const INDIA_AVERAGE_CO2 = 1.9; // tonnes per year

export const SUSTAINABILITY_THRESHOLDS = {
  excellent: 5,   // kg/day
  good: 10,
  moderate: 15,
  poor: 20,
};
