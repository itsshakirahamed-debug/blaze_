import { motion } from 'framer-motion';

export default function RiskGauge({ riskScore }) {
  const score = Number(riskScore);
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRiskLevel = (score) => {
    if (score < 30) {
      return {
        level: 'Low',
        color: '#10b981', // Emerald
        bgColor: '#f0fdf4',
        textColor: '#15803d',
        borderColor: '#bbf7d0/30'
      };
    }
    if (score < 70) {
      return {
        level: 'Medium',
        color: '#f59e0b', // Amber
        bgColor: '#fffbeb',
        textColor: '#b45309',
        borderColor: '#fef3c7/30'
      };
    }
    return {
      level: 'High',
      color: '#f43f5e', // Rose
      bgColor: '#fff1f2',
      textColor: '#be123c',
      borderColor: '#ffe4e6/30'
    };
  };

  const risk = getRiskLevel(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center bg-white border border-slate-200/60 p-8 rounded-[16px] shadow-sm flex flex-col items-center justify-between h-full space-y-4"
    >
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
          Legal Risk Index
        </span>
        <h3 className="text-sm font-bold text-slate-800 mt-1">Overall Risk Score</h3>
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background Circle */}
          <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
          {/* Progress Circle */}
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={risk.color}
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900">{Math.round(score)}%</span>
          <span className="text-[10px] font-medium text-slate-400 mt-0.5">Aggregate Risk</span>
        </div>
      </div>

      <div className="w-full space-y-2 border-t border-slate-100 pt-3 flex-shrink-0">
        <div
          style={{ backgroundColor: risk.bgColor, borderColor: risk.borderColor }}
          className="rounded-xl px-4 py-2 border w-full text-center"
        >
          <p className="text-xs font-bold" style={{ color: risk.textColor }}>
            {risk.level} Risk Profile
          </p>
        </div>
        <div className="text-left space-y-1 pl-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Calculated using:</p>
          <ul className="text-[9px] text-slate-505 font-medium space-y-0.5 list-disc pl-3">
            <li>Clause severity &amp; frequency</li>
            <li>High-risk clause count</li>
            <li>Contract complexity</li>
            <li>Legal language analysis</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}