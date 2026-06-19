import { EMISSION_FACTORS, SUSTAINABILITY_THRESHOLDS, DAILY_AVERAGE_CO2 } from '../data/emissionFactors';

/**
 * Calculate carbon emissions from all categories
 * @param {Object} data - Calculator form data
 * @returns {Object} Breakdown and total emissions in kg CO₂
 */
export function calculateCarbonEmissions(data) {
  const { transportation, energy, food, waste } = data;

  // Transportation (kg CO₂)
  const transportationEmissions = {
    car: (parseFloat(transportation.car) || 0) * EMISSION_FACTORS.transportation.car,
    bus: (parseFloat(transportation.bus) || 0) * EMISSION_FACTORS.transportation.bus,
    train: (parseFloat(transportation.train) || 0) * EMISSION_FACTORS.transportation.train,
    bike: 0,
    flight: (parseFloat(transportation.flight) || 0) * EMISSION_FACTORS.transportation.flight,
    motorcycle: (parseFloat(transportation.motorcycle) || 0) * EMISSION_FACTORS.transportation.motorcycle,
  };
  const transportTotal = Object.values(transportationEmissions).reduce((a, b) => a + b, 0);

  // Energy (kg CO₂)
  const energyEmissions = {
    electricity: (parseFloat(energy.electricity) || 0) * EMISSION_FACTORS.energy.electricity,
    lpg: (parseFloat(energy.lpg) || 0) * EMISSION_FACTORS.energy.lpg,
    water: (parseFloat(energy.water) || 0) * EMISSION_FACTORS.energy.water,
  };
  const energyTotal = Object.values(energyEmissions).reduce((a, b) => a + b, 0);

  // Food (kg CO₂/day × days)
  const dietType = food.dietType || 'vegetarian';
  const days = parseFloat(food.days) || 1;
  const foodTotal = EMISSION_FACTORS.food[dietType] * days;

  // Waste (kg CO₂)
  const recyclingFactor = 1 - (parseFloat(waste.recyclingPercentage) || 0) / 100;
  const wasteEmissions = {
    plastic: (parseFloat(waste.plastic) || 0) * EMISSION_FACTORS.waste.plastic * recyclingFactor,
    paper: (parseFloat(waste.paper) || 0) * EMISSION_FACTORS.waste.paper * recyclingFactor,
    organic: (parseFloat(waste.organic) || 0) * EMISSION_FACTORS.waste.organic,
  };
  const wasteTotal = Object.values(wasteEmissions).reduce((a, b) => a + b, 0);

  const totalEmissions = transportTotal + energyTotal + foodTotal + wasteTotal;

  return {
    breakdown: {
      transportation: Math.round(transportTotal * 100) / 100,
      energy: Math.round(energyTotal * 100) / 100,
      food: Math.round(foodTotal * 100) / 100,
      waste: Math.round(wasteTotal * 100) / 100,
    },
    details: {
      transportationEmissions,
      energyEmissions,
      wasteEmissions,
    },
    totalEmissions: Math.round(totalEmissions * 100) / 100,
  };
}

/**
 * Calculate sustainability score (0-100)
 * Lower emissions = higher score
 */
export function calculateSustainabilityScore(totalEmissionsKg) {
  // 0 kg → 100 score, DAILY_AVERAGE_CO2*2 → 0 score
  const maxBad = DAILY_AVERAGE_CO2 * 2; // ~25.76 kg
  const score = Math.max(0, Math.min(100, 100 - (totalEmissionsKg / maxBad) * 100));
  return Math.round(score);
}

/**
 * Get sustainability level label
 */
export function getSustainabilityLevel(score) {
  if (score >= 80) return { label: 'Excellent', color: '#10b981', emoji: '🌟' };
  if (score >= 60) return { label: 'Good', color: '#3b82f6', emoji: '👍' };
  if (score >= 40) return { label: 'Moderate', color: '#f59e0b', emoji: '⚠️' };
  return { label: 'Needs Work', color: '#ef4444', emoji: '🔴' };
}

/**
 * Generate mock weekly data for charts (last 7 days)
 */
export function generateWeeklyData(currentTotal) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    emissions: Math.round((currentTotal * (0.7 + Math.random() * 0.6)) * 10) / 10,
    target: DAILY_AVERAGE_CO2,
  }));
}

/**
 * Generate mock monthly data for charts (last 6 months)
 */
export function generateMonthlyData(currentTotal) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    month,
    emissions: Math.round((currentTotal * 30 * (0.8 + Math.random() * 0.4)) * 10) / 10,
    target: DAILY_AVERAGE_CO2 * 30,
  }));
}
