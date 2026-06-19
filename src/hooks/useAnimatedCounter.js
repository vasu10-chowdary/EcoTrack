import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to target over a duration
 */
export function useAnimatedCounter(target, duration = 1500, decimals = 1) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const prevTarget = useRef(null);

  useEffect(() => {
    if (target === prevTarget.current) return;
    prevTarget.current = target;

    const startValue = count;
    const endValue = parseFloat(target) || 0;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = startValue + (endValue - startValue) * eased;
      setCount(Math.round(current * Math.pow(10, decimals)) / Math.pow(10, decimals));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration, decimals]);

  return count;
}
