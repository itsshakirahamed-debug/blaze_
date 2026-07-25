import { motion } from 'framer-motion';

const VERDICT_CONFIG = {
  safe: {
    match: (r) => r.includes('Safe') || r.includes('🟢'),
    icon: '🟢',
    label: 'Safe to Sign',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200/70',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    accent: 'text-emerald-700',
    bar: 'bg-emerald-400',
  },
  review: {
    match: (r) => r.includes('Review') || r.includes('🟡'),
    icon: '🟡',
    label: 'Review with Legal Team',
    bg: 'bg-amber-50',
    border: 'border-amber-200/70',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    accent: 'text-amber-700',
    bar: 'bg-amber-400',
  },
  negotiate: {
    match: (r) => r.includes('Negotiate') || r.includes('🟠'),
    icon: '🟠',
    label: 'Negotiate Before Signing',
    bg: 'bg-orange-50',
    border: 'border-orange-200/70',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    accent: 'text-orange-700',
    bar: 'bg-orange-400',
  },
  danger: {
    match: (r) => r.includes('Do Not') || r.includes('🔴'),
    icon: '🔴',
    label: 'Do Not Sign',
    bg: 'bg-rose-50',
    border: 'border-rose-200/70',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    accent: 'text-rose-700',
    bar: 'bg-rose-500',
  },
};

export default function RecommendationCard({ recommendation, recommendationReason }) {
  if (!recommendation) return null;

  // Resolve which config to use
  const config =
    Object.values(VERDICT_CONFIG).find((c) => c.match(recommendation)) ||
    VERDICT_CONFIG.review;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`border rounded-[16px] p-6 shadow-sm space-y-5 ${config.bg} ${config.border}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 bg-white border border-slate-200/60 rounded-xl flex items-center justify-center text-sm flex-shrink-0 shadow-sm">
          ⚖️
        </span>
        <div>
          <h3 className="text-sm font-bold text-slate-800">AI Signing Recommendation</h3>
          <p className="text-[10px] text-slate-400">Actionable verdict based on full contract analysis</p>
        </div>
      </div>

      {/* Verdict Badge (most prominent) */}
      <div className="flex items-center gap-3">
        <span className={`text-2xl font-extrabold ${config.accent}`}>{config.icon}</span>
        <span className={`px-4 py-1.5 rounded-xl border text-sm font-extrabold tracking-tight ${config.badge}`}>
          {config.label}
        </span>
      </div>

      {/* Color bar accent */}
      <div className={`h-1 w-full rounded-full ${config.bar} opacity-40`} />

      {/* Reason */}
      {recommendationReason && (
        <div className="space-y-1">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Reason</p>
          <p className="text-[12px] text-slate-700 font-medium leading-relaxed">
            {recommendationReason}
          </p>
        </div>
      )}
    </motion.div>
  );
}
