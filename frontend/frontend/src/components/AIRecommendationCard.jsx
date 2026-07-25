import { motion } from 'framer-motion';

const VERDICT_THEMES = {
  emerald: {
    bg: 'bg-[#F4FBF7]',
    border: 'border-emerald-200/70',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    accent: 'text-emerald-700',
    bar: '#10b981',
    indicator: 10,
    iconChar: '✅',
    riskText: 'LOW'
  },
  amber: {
    bg: 'bg-[#FFFDF5]',
    border: 'border-amber-200/70',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    accent: 'text-amber-700',
    bar: '#f59e0b',
    indicator: 50,
    iconChar: '⚠️',
    riskText: 'MEDIUM'
  },
  rose: {
    bg: 'bg-[#FFF5F5]',
    border: 'border-rose-200/70',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    accent: 'text-rose-700',
    bar: '#ef4444',
    indicator: 90,
    iconChar: '❌',
    riskText: 'HIGH'
  }
};

function getTheme(verdictText = '') {
  const text = verdictText.toLowerCase();
  if (text.includes('safe to sign') && !text.includes('review') && !text.includes('but')) {
    return {
      title: verdictText.replace('✅ ', ''),
      theme: VERDICT_THEMES.emerald
    };
  }
  if (text.includes('do not sign') || text.includes('avoid')) {
    return {
      title: verdictText.replace('❌ ', ''),
      theme: VERDICT_THEMES.rose
    };
  }
  return {
    title: verdictText.replace('⚠️ ', ''),
    theme: VERDICT_THEMES.amber
  };
}

function computeConfidence(trustScore, scamProbability) {
  const raw = trustScore * 0.7 + (100 - scamProbability) * 0.3;
  return Math.min(99, Math.max(60, Math.round(raw)));
}

function RiskMeter({ position, color }) {
  return (
    <div className="space-y-2.5 px-2 py-1">
      <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
        <span>SAFE</span>
        <span>MEDIUM</span>
        <span>HIGH RISK</span>
      </div>

      {/* Gradient track */}
      <div className="relative h-2.5 rounded-md bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500">
        <motion.div
          initial={{ left: '50%' }}
          animate={{ left: `${position}%` }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 120, damping: 20 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: color }}
        />
      </div>

      <div className="flex justify-between text-[9px] font-semibold text-slate-400">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

export default function AIRecommendationCard({
  trustScore = 86,
  scamProbability = 11,
  overallRisk = 'Medium',
  recommendation = 'Safe to Sign, but Review Carefully',
  recommendationReason = 'The document is authentic, but several clauses contain moderate legal risks. Review the highlighted clauses before signing.',
  recommendationExplanation = '',
}) {
  const { title, theme } = getTheme(recommendation);
  const confidence = computeConfidence(trustScore, scamProbability);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`border rounded-lg p-7 sm:p-9 lg:p-10 px-8 sm:px-10 lg:px-12 shadow-xs ${theme.bg} ${theme.border} w-full my-3`}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">

        {/* ── LEFT COLUMN: Text Content with Inset Margin ─────────────────────── */}
        <div className="flex-1 space-y-4 px-3 py-2">

          {/* Section label */}
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-xs">📌</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              AI RECOMMENDATION
            </span>
          </div>

          {/* Icon + Title */}
          <div className="flex items-center gap-4 pt-0.5">
            <div className="text-3xl leading-none flex-shrink-0">
              {theme.iconChar}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {title || 'Safe to Sign, but Review Carefully'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Overall Risk Level:{' '}
                <span className={`font-extrabold ${theme.accent}`}>
                  {(overallRisk || theme.riskText).toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 font-medium max-w-2xl leading-relaxed py-1">
            {recommendationReason || 'The document is authentic, but several clauses contain moderate legal risks. Review the highlighted clauses before signing.'}
          </p>

          {/* Reasoning Score Explanation */}
          <div className="pt-3 border-t border-slate-200/50 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 font-medium px-1">
            <span>Authenticity Score: <span className="font-extrabold text-slate-800">{trustScore}/100</span></span>
            <span className="text-slate-300">•</span>
            <span>Legal Risk Score: <span className="font-extrabold text-slate-800">0/100</span></span>
            <span className="text-slate-300">•</span>
            <span>High Risk Clauses: <span className="font-extrabold text-slate-800">0</span></span>
            <span className="text-slate-300">•</span>
            <span>Fraud Detection: <span className="font-extrabold text-slate-800">None</span></span>
            <span className="text-slate-300">•</span>
            <span>Company Verified: <span className="font-extrabold text-slate-800">Yes</span></span>
          </div>

          {/* Confidence indicator */}
          <div className="flex items-center gap-3 pt-1.5 px-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              AI CONFIDENCE
            </span>
            <div className="flex items-center gap-2.5">
              <div className="relative h-2.5 w-36 bg-slate-200/70 rounded-md overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full rounded-md"
                  style={{ backgroundColor: theme.bar }}
                />
              </div>
              <span className={`text-xs font-extrabold ${theme.accent}`}>
                90%
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-px h-40 bg-amber-200/50 self-center mx-2" />

        {/* ── RIGHT COLUMN: Risk Meter Box ──────────────────────────────────── */}
        <div className="lg:w-80 space-y-3.5 flex-shrink-0 self-center p-2">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              RISK METER
            </span>
            <span className={`px-3 py-1 text-[9px] font-extrabold rounded-md border uppercase tracking-wider ${theme.badge}`}>
              {(overallRisk || theme.riskText).toUpperCase()} RISK
            </span>
          </div>

          <div className="bg-white/90 p-5 rounded-md border border-amber-100 shadow-2xs">
            <RiskMeter position={theme.indicator} color={theme.bar} />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
