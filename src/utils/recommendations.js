import { EMISSION_FACTORS } from '../data/emissionFactors';

/**
 * Generate personalized recommendations based on calculator data and emission breakdown
 */
export function generateRecommendations(calculatorData, emissions) {
  const recs = [];
  if (!calculatorData || !emissions) return recs;

  const { transportation, energy, food, waste } = calculatorData;
  const { breakdown } = emissions;

  // ── Transportation ──
  const carDist = parseFloat(transportation.car) || 0;
  const flightDist = parseFloat(transportation.flight) || 0;
  const busDist = parseFloat(transportation.bus) || 0;
  const trainDist = parseFloat(transportation.train) || 0;
  const bikeDist = parseFloat(transportation.bike) || 0;

  if (carDist > 20) {
    recs.push({
      id: 'r-car-public',
      category: 'transportation',
      priority: 'high',
      icon: '🚌',
      title: 'Switch to Public Transport',
      description: `You drive ${carDist} km daily. Switching to bus/train for even 50% of trips saves ${Math.round(carDist * 0.5 * (EMISSION_FACTORS.transportation.car - EMISSION_FACTORS.transportation.bus) * 100) / 100} kg CO₂.`,
      co2Savings: Math.round(carDist * 0.5 * (EMISSION_FACTORS.transportation.car - EMISSION_FACTORS.transportation.bus) * 100) / 100,
      actions: ['Use metro or city bus for daily commutes', 'Carpool with colleagues', 'Plan trips to avoid peak traffic'],
    });
  }

  if (carDist > 5 && bikeDist < 5) {
    recs.push({
      id: 'r-cycling',
      category: 'transportation',
      priority: carDist > 15 ? 'high' : 'medium',
      icon: '🚲',
      title: 'Cycle Short Distances',
      description: 'Cycling replaces car trips under 5 km and produces zero CO₂ while improving your health!',
      co2Savings: Math.min(carDist, 5) * EMISSION_FACTORS.transportation.car,
      actions: ['Buy or rent a bicycle', 'Use cycling apps to find routes', 'Start with 1–2 days per week'],
    });
  }

  if (flightDist > 500) {
    recs.push({
      id: 'r-flight',
      category: 'transportation',
      priority: 'high',
      icon: '✈️',
      title: 'Reduce Air Travel',
      description: `Your ${flightDist} km of flying emits ${Math.round(flightDist * EMISSION_FACTORS.transportation.flight)} kg CO₂. Consider train travel or video calls.`,
      co2Savings: Math.round(flightDist * (EMISSION_FACTORS.transportation.flight - EMISSION_FACTORS.transportation.train)),
      actions: ['Use video calls for business meetings', 'Choose trains for trips under 600 km', 'Offset unavoidable flights'],
    });
  }

  // ── Energy ──
  const electricity = parseFloat(energy.electricity) || 0;
  const lpg = parseFloat(energy.lpg) || 0;

  if (electricity > 10) {
    recs.push({
      id: 'r-electricity',
      category: 'energy',
      priority: electricity > 20 ? 'high' : 'medium',
      icon: '💡',
      title: 'Reduce Electricity Consumption',
      description: `You use ${electricity} kWh of electricity. A 20% reduction would save ${Math.round(electricity * 0.2 * EMISSION_FACTORS.energy.electricity * 100) / 100} kg CO₂.`,
      co2Savings: Math.round(electricity * 0.2 * EMISSION_FACTORS.energy.electricity * 100) / 100,
      actions: ['Switch to LED lighting', 'Set AC at 24°C or higher', 'Unplug devices not in use', 'Install solar panels'],
    });
  }

  if (lpg > 5) {
    recs.push({
      id: 'r-lpg',
      category: 'energy',
      priority: 'medium',
      icon: '🔥',
      title: 'Reduce LPG Usage',
      description: `Using ${lpg} kg of LPG emits ${Math.round(lpg * EMISSION_FACTORS.energy.lpg * 100) / 100} kg CO₂. Switch to induction cooking.`,
      co2Savings: Math.round(lpg * EMISSION_FACTORS.energy.lpg * 0.3 * 100) / 100,
      actions: ['Use an induction cooktop', 'Cook multiple meals together', 'Use solar water heaters'],
    });
  }

  if (electricity > 5) {
    recs.push({
      id: 'r-solar',
      category: 'energy',
      priority: 'low',
      icon: '☀️',
      title: 'Consider Solar Energy',
      description: 'Installing rooftop solar panels can eliminate 70–100% of your electricity emissions.',
      co2Savings: Math.round(electricity * 0.8 * EMISSION_FACTORS.energy.electricity * 100) / 100,
      actions: ['Get a solar panel quote', 'Check government subsidies', 'Start with solar water heating'],
    });
  }

  // ── Food ──
  const diet = food.dietType;
  if (diet === 'nonVegetarian') {
    recs.push({
      id: 'r-food-meatless',
      category: 'food',
      priority: 'high',
      icon: '🥗',
      title: 'Try Meatless Mondays',
      description: 'Non-vegetarian diets emit 3× more CO₂ than vegan diets. Even one meatless day per week saves ~2.2 kg CO₂.',
      co2Savings: 2.2,
      actions: ['Replace one meat meal per week with legumes', 'Try tofu, paneer, or lentil dishes', 'Explore plant-based protein recipes'],
    });
    recs.push({
      id: 'r-food-local',
      category: 'food',
      priority: 'medium',
      icon: '🌾',
      title: 'Buy Local & Seasonal Food',
      description: 'Locally sourced food has 10× lower transport emissions. Visit your nearest farmers\' market.',
      co2Savings: 0.5,
      actions: ['Shop at local markets', 'Grow a small herb garden', 'Choose seasonal produce'],
    });
  }

  if (diet === 'eggetarian') {
    recs.push({
      id: 'r-food-veg',
      category: 'food',
      priority: 'medium',
      icon: '🥦',
      title: 'Move Towards Vegetarian',
      description: 'Replacing eggs with plant proteins 2× a week can save ~0.4 kg CO₂ per week.',
      co2Savings: 0.4,
      actions: ['Add more legumes and beans', 'Try tofu scramble as an egg alternative', 'Explore vegetarian cuisine'],
    });
  }

  // ── Waste ──
  const plastic = parseFloat(waste.plastic) || 0;
  const paper = parseFloat(waste.paper) || 0;
  const recycling = parseFloat(waste.recyclingPercentage) || 0;

  if (plastic > 1) {
    recs.push({
      id: 'r-plastic',
      category: 'waste',
      priority: 'high',
      icon: '🚫',
      title: 'Eliminate Single-Use Plastic',
      description: `You generate ${plastic} kg of plastic waste. Reducing by 50% saves ${Math.round(plastic * 0.5 * EMISSION_FACTORS.waste.plastic * 100) / 100} kg CO₂.`,
      co2Savings: Math.round(plastic * 0.5 * EMISSION_FACTORS.waste.plastic * 100) / 100,
      actions: ['Use reusable bags and bottles', 'Choose products with minimal packaging', 'Say no to straws and disposables'],
    });
  }

  if (recycling < 50) {
    recs.push({
      id: 'r-recycling',
      category: 'waste',
      priority: recycling < 20 ? 'high' : 'medium',
      icon: '♻️',
      title: 'Increase Recycling Rate',
      description: `Your recycling rate is ${recycling}%. Reaching 80% can significantly cut waste emissions.`,
      co2Savings: Math.round((plastic + paper) * ((80 - recycling) / 100) * 0.2 * 100) / 100,
      actions: ['Set up separate bins for paper, plastic, and glass', 'Learn your local recycling rules', 'Compost organic waste'],
    });
  }

  // ── General ──
  recs.push({
    id: 'r-awareness',
    category: 'general',
    priority: 'low',
    icon: '📚',
    title: 'Track & Educate',
    description: 'Regularly tracking your footprint and educating others multiplies your positive impact.',
    co2Savings: 0,
    actions: ['Use EcoTrack daily', 'Share your progress with friends', 'Join environmental groups', 'Support climate-conscious brands'],
  });

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
