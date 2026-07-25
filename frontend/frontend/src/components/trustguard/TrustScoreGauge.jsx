import { motion } from 'framer-motion';

export default function TrustScoreGauge({ trustScore = 86, status = "Trusted" }) {
  const score = Number(trustScore);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white p-7 sm:p-8 rounded-lg border border-slate-200/70 shadow-xs flex flex-col justify-between items-center text-center h-full space-y-4 min-h-[220px]">
      <div className="px-2 py-1 space-y-4 w-full flex flex-col items-center">
        {/* Title */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-blue-500 text-sm">🛡️</span>
          <h3 className="text-sm font-extrabold text-slate-900">
            Document Authenticity
          </h3>
        </div>

        {/* Centered Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center my-1">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="45" stroke="#f1f5f9" strokeWidth="9" fill="transparent" />
            <motion.circle
              cx="55"
              cy="55"
              r="45"
              stroke="#10b981"
              strokeWidth="9"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">
              {score}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 mt-1">out of 100</span>
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="w-full text-center px-1">
          <span className="inline-block px-6 py-2 rounded-md text-xs font-extrabold w-full border bg-emerald-50 text-emerald-700 border-emerald-100 shadow-2xs">
            {status || 'Trusted'}
          </span>
        </div>
      </div>
    </div>
  );
}
