import { useTheme } from '../../context/ThemeContext';
import { getSustainabilityLevel } from '../../utils/carbonCalculations';

export default function CarbonGauge({ score = 0 }) {
  const { isDark } = useTheme();
  const level = getSustainabilityLevel(score);

  // SVG arc gauge
  const size = 200;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = 78;
  const strokeWidth = 14;

  // Arc goes from 210° to -30° (240° total sweep, left to right)
  const startAngle = 210;
  const endAngle = -30;
  const totalAngle = startAngle - endAngle; // 240
  const progressAngle = (score / 100) * totalAngle;

  function polarToCartesian(angle) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeArc(start, end) {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = Math.abs(start - end) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
  }

  const bgPath = describeArc(startAngle, endAngle + 1);
  const progressPath = describeArc(startAngle, startAngle - progressAngle);

  // Gradient ID
  const gradId = `gauge-${score}`;

  // Tick marks
  const ticks = [0, 25, 50, 75, 100].map((v) => {
    const angle = startAngle - (v / 100) * totalAngle;
    const outerR = r + 16;
    const innerR = r + 6;
    const outer = polarToCartesian(angle);
    const inner = polarToCartesian(angle);
    const outerPt = { x: cx + outerR * Math.cos(((angle - 90) * Math.PI) / 180), y: cy + outerR * Math.sin(((angle - 90) * Math.PI) / 180) };
    const innerPt = { x: cx + innerR * Math.cos(((angle - 90) * Math.PI) / 180), y: cy + innerR * Math.sin(((angle - 90) * Math.PI) / 180) };
    const labelPt = { x: cx + (outerR + 10) * Math.cos(((angle - 90) * Math.PI) / 180), y: cy + (outerR + 10) * Math.sin(((angle - 90) * Math.PI) / 180) };
    return { v, outerPt, innerPt, labelPt };
  });

  // Needle angle
  const needleAngle = startAngle - progressAngle;
  const needleRad = ((needleAngle - 90) * Math.PI) / 180;
  const needleLen = r - 10;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy + needleLen * Math.sin(needleRad);

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const subColor = isDark ? '#94a3b8' : '#64748b';
  const bgArcColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size - 10} viewBox={`0 0 ${size} ${size - 10}`}>
        <defs>
          <linearGradient id={gradId} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={bgPath}
          fill="none"
          stroke={bgArcColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        {score > 0 && (
          <path
            d={progressPath}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#glow)"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        )}

        {/* Tick marks */}
        {ticks.map(({ v, outerPt, innerPt, labelPt }) => (
          <g key={v}>
            <line
              x1={innerPt.x} y1={innerPt.y}
              x2={outerPt.x} y2={outerPt.y}
              stroke={subColor}
              strokeWidth={1.5}
              opacity={0.5}
            />
            <text
              x={labelPt.x} y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={8}
              fill={subColor}
              opacity={0.7}
            >
              {v}
            </text>
          </g>
        ))}

        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={nx} y2={ny}
          stroke={level.color}
          strokeWidth={2.5}
          strokeLinecap="round"
          filter="url(#glow)"
        />
        <circle cx={cx} cy={cy} r={6} fill={level.color} filter="url(#glow)" />
        <circle cx={cx} cy={cy} r={3} fill="white" />

        {/* Center text */}
        <text x={cx} y={cy + 28} textAnchor="middle" fontSize={26} fontWeight="800" fill={level.color}>
          {score}
        </text>
        <text x={cx} y={cy + 44} textAnchor="middle" fontSize={10} fill={subColor}>
          out of 100
        </text>
        <text x={cx} y={cy + 58} textAnchor="middle" fontSize={13} fontWeight="600" fill={level.color}>
          {level.emoji} {level.label}
        </text>
      </svg>
    </div>
  );
}
