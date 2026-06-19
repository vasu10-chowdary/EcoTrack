import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateCarbonEmissions, calculateSustainabilityScore, generateWeeklyData, generateMonthlyData } from '../utils/carbonCalculations';

const AppContext = createContext();

const DEFAULT_CALC_DATA = {
  transportation: { car: '', bus: '', train: '', bike: '', flight: '', motorcycle: '' },
  energy: { electricity: '', lpg: '', water: '' },
  food: { dietType: 'vegetarian', days: '1' },
  waste: { plastic: '', paper: '', organic: '', recyclingPercentage: '0' },
};

const DEFAULT_STATE = {
  calculatorData: DEFAULT_CALC_DATA,
  emissions: null,
  sustainabilityScore: 0,
  weeklyData: [],
  monthlyData: [],
  history: [],
  completedChallenges: [],
  totalCo2Saved: 0,
  totalPoints: 0,
  userName: 'Eco Warrior',
  userAvatar: '🌱',
};

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('ecotrack-state');
    if (saved) return { ...DEFAULT_STATE, ...JSON.parse(saved) };
  } catch (_) {}
  return DEFAULT_STATE;
}

function saveToStorage(state) {
  try {
    localStorage.setItem('ecotrack-state', JSON.stringify(state));
  } catch (_) {}
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadFromStorage);
  const [toasts, setToasts] = useState([]);

  // Persist to localStorage on state change
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const submitCalculation = useCallback((formData) => {
    const result = calculateCarbonEmissions(formData);
    const score = calculateSustainabilityScore(result.totalEmissions);
    const weekly = generateWeeklyData(result.totalEmissions);
    const monthly = generateMonthlyData(result.totalEmissions);

    const historyEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-IN'),
      total: result.totalEmissions,
      breakdown: result.breakdown,
      score,
    };

    setState((prev) => ({
      ...prev,
      calculatorData: formData,
      emissions: result,
      sustainabilityScore: score,
      weeklyData: weekly,
      monthlyData: monthly,
      history: [historyEntry, ...prev.history].slice(0, 30),
    }));

    addToast('✅ Carbon footprint calculated and saved!', 'success');
    return result;
  }, [addToast]);

  const completeChallenge = useCallback((challenge) => {
    setState((prev) => {
      if (prev.completedChallenges.includes(challenge.id)) return prev;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challenge.id],
        totalCo2Saved: Math.round((prev.totalCo2Saved + challenge.co2Saved) * 100) / 100,
        totalPoints: prev.totalPoints + challenge.points,
      };
    });
    addToast(`🏆 Challenge completed! +${challenge.points} points`, 'success');
  }, [addToast]);

  const updateProfile = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
    addToast('👤 Profile updated!', 'info');
  }, [addToast]);

  const resetData = useCallback(() => {
    setState(DEFAULT_STATE);
    addToast('🔄 Data reset successfully', 'info');
  }, [addToast]);

  return (
    <AppContext.Provider value={{
      ...state,
      toasts,
      addToast,
      removeToast,
      submitCalculation,
      completeChallenge,
      updateProfile,
      resetData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
