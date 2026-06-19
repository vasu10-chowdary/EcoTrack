export const CHATBOT_RESPONSES = [
  // Greetings
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening'],
    response: "👋 Hello! I'm EcoBot, your personal sustainability assistant. I can help you understand carbon footprints, suggest eco-friendly habits, and guide you on your green journey. What would you like to know?",
  },
  // Carbon footprint basics
  {
    keywords: ['what is carbon footprint', 'carbon footprint', 'co2', 'greenhouse', 'emissions'],
    response: "🌍 A **carbon footprint** is the total amount of greenhouse gases (primarily CO₂) produced directly or indirectly by your activities. The global average is about 4.7 tonnes of CO₂ per person per year. Key contributors include:\n\n• 🚗 Transportation (28%)\n• 🏠 Home energy (25%)\n• 🥗 Food production (20%)\n• 🏭 Industry & goods (27%)\n\nReducing your footprint helps combat climate change!",
  },
  // Transportation tips
  {
    keywords: ['transport', 'car', 'drive', 'flight', 'travel', 'commute', 'bus', 'train'],
    response: "🚗 **Transportation Tips:**\n\n• 🚌 Switch to public transport — saves up to 2.4 kg CO₂/day\n• 🚲 Cycle or walk short distances — zero emissions!\n• ✈️ Avoid flying when possible — 1 short-haul flight ≈ 255 kg CO₂\n• 🚗 Carpool to split emissions\n• ⚡ Consider an electric vehicle\n• 🏠 Work from home when possible\n\nTransportation is often the biggest contributor to personal carbon footprint!",
  },
  // Food tips
  {
    keywords: ['food', 'diet', 'eat', 'meat', 'vegan', 'vegetarian', 'meal'],
    response: "🥗 **Food & Diet Tips:**\n\n• 🌱 Going vegan saves ~2.2 kg CO₂/day vs. non-vegetarian\n• 🥦 Eat seasonal, local produce to reduce food miles\n• 🍽️ Reduce food waste — 1/3 of all food produced is wasted\n• 🛒 Buy in bulk to reduce packaging\n• 🌾 Choose plant proteins over animal proteins\n\n**Daily CO₂ by diet:**\n• Vegan: 0.8 kg\n• Vegetarian: 1.0 kg\n• Eggetarian: 1.5 kg\n• Non-vegetarian: 3.0 kg",
  },
  // Energy tips
  {
    keywords: ['energy', 'electricity', 'power', 'solar', 'renewable', 'appliance', 'led'],
    response: "⚡ **Home Energy Tips:**\n\n• 💡 Switch to LED bulbs — use 75% less energy\n• 🌡️ Set AC to 24°C instead of 18°C — saves 25% energy\n• ☀️ Install solar panels for clean energy\n• 🔌 Unplug electronics on standby\n• 🌊 Take shorter, cooler showers\n• 🏠 Improve home insulation\n• 🌬️ Use ceiling fans instead of AC when possible\n\nEvery 1 kWh saved = 0.82 kg CO₂ avoided!",
  },
  // Waste tips
  {
    keywords: ['waste', 'recycle', 'plastic', 'rubbish', 'trash', 'garbage', 'compost'],
    response: "♻️ **Waste Reduction Tips:**\n\n• ❌ Refuse single-use plastics\n• 🛍️ Carry reusable bags & bottles\n• 🗑️ Separate and recycle — plastic, paper, glass, metals\n• 🌿 Compost organic waste\n• 📦 Buy products with minimal packaging\n• 🔄 Repair before replacing\n• 🛒 Buy second-hand when possible\n\nRecycling 1 kg of plastic saves ~0.4 kg CO₂!",
  },
  // Sustainability score
  {
    keywords: ['score', 'sustainability score', 'rating', 'how am i doing', 'performance'],
    response: "📊 **Sustainability Score Explained:**\n\nYour score (0-100) rates your environmental impact:\n\n• 🟢 **80-100** — Excellent! You're a climate hero\n• 🔵 **60-79** — Good effort, keep improving\n• 🟡 **40-59** — Moderate impact, room to grow\n• 🔴 **Below 40** — High impact, action needed\n\nComplete daily challenges and reduce consumption to improve your score!",
  },
  // Challenges
  {
    keywords: ['challenge', 'badge', 'achievement', 'task', 'mission'],
    response: "🏆 **EcoTrack Challenges:**\n\nChallenges are a fun way to build sustainable habits!\n\n• **Daily challenges** — Quick wins you can do today\n• **Weekly challenges** — Bigger commitments for greater impact\n• **Badges** — Earn recognition for your achievements\n\nCompleting challenges earns you points and badges. Start with easy ones like 'Meatless Meal' or 'Energy Saver' and work your way up to 'Car-Free Week'!",
  },
  // Climate change
  {
    keywords: ['climate change', 'global warming', 'temperature', 'paris agreement'],
    response: "🌡️ **Climate Change Facts:**\n\nThe planet has warmed ~1.1°C since pre-industrial times. To limit warming to 1.5°C (Paris Agreement target), we need to cut global emissions by 45% by 2030.\n\n**What you can do:**\n• Reduce personal carbon footprint\n• Support renewable energy\n• Vote for climate-conscious leaders\n• Spread awareness\n\nIf everyone reduced their footprint to 2 tonnes/year, we'd be on track to meet climate goals!",
  },
  // PDF export
  {
    keywords: ['report', 'pdf', 'export', 'download', 'certificate'],
    response: "📄 **Export Your Report:**\n\nYou can download your sustainability report as a PDF from the Dashboard page. The report includes:\n\n• Your total carbon emissions\n• Category breakdown\n• Sustainability score\n• Progress charts\n• Personalized recommendations\n\nThis is great for tracking your progress or sharing with others!",
  },
  // Default fallback
  {
    keywords: [],
    response: "🤔 I'm not sure I understood that. I can help you with:\n\n• 🌍 Understanding carbon footprints\n• 🚗 Transportation tips\n• 🥗 Food & diet choices\n• ⚡ Home energy saving\n• ♻️ Waste reduction\n• 📊 Your sustainability score\n• 🏆 Challenges & badges\n• 🌡️ Climate change facts\n\nTry asking about any of these topics!",
  },
];

export function getBotResponse(message) {
  const lowerMsg = message.toLowerCase();
  for (const item of CHATBOT_RESPONSES) {
    if (item.keywords.length === 0) continue;
    if (item.keywords.some((kw) => lowerMsg.includes(kw))) {
      return item.response;
    }
  }
  // Return fallback
  return CHATBOT_RESPONSES[CHATBOT_RESPONSES.length - 1].response;
}
