/**
 * RiskCard.jsx
 * Redesigned clean SaaS-style clause card with support for grouped categories.
 * - Semantic clause icon based on type
 * - One-line plain-English summary (primary view)
 * - Support for displaying multiple occurrences under a single category card
 * - Collapsible detail panels for individual child clauses
 * - Color-coded risk badge (High / Medium / Low)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// ─── Clause Icon Map ──────────────────────────────────────────────────────────
const CLAUSE_ICONS = {
  payment:        { icon: '💰', label: 'Payment' },
  billing:        { icon: '💰', label: 'Billing' },
  fee:            { icon: '💰', label: 'Fee' },
  termination:    { icon: '📄', label: 'Termination' },
  terminate:      { icon: '📄', label: 'Termination' },
  confidential:   { icon: '🔒', label: 'Confidentiality' },
  privacy:        { icon: '🔒', label: 'Privacy' },
  liability:      { icon: '⚖️', label: 'Liability' },
  limitation:     { icon: '⚖️', label: 'Liability' },
  indemnif:       { icon: '🛡️', label: 'Indemnification' },
  indemnity:      { icon: '🛡️', label: 'Indemnification' },
  intellectual:   { icon: '💡', label: 'Intellectual Property' },
  copyright:      { icon: '💡', label: 'Copyright' },
  'ip ':          { icon: '💡', label: 'IP Rights' },
  arbitration:    { icon: '⚖️', label: 'Arbitration' },
  dispute:        { icon: '🏛️', label: 'Dispute Resolution' },
  governing:      { icon: '🏛️', label: 'Governing Law' },
  jurisdiction:   { icon: '🏛️', label: 'Jurisdiction' },
  warranty:       { icon: '✅', label: 'Warranty' },
  disclaimer:     { icon: '⚠️', label: 'Disclaimer' },
  renewal:        { icon: '🔄', label: 'Renewal' },
  auto:           { icon: '🔄', label: 'Auto-Renewal' },
  non_compete:    { icon: '🚫', label: 'Non-Compete' },
  compete:        { icon: '🚫', label: 'Non-Compete' },
  force:          { icon: '🌪️', label: 'Force Majeure' },
  majeure:        { icon: '🌪️', label: 'Force Majeure' },
  data:           { icon: '🗄️', label: 'Data Handling' },
  assignment:     { icon: '📋', label: 'Assignment' },
  subcontract:    { icon: '📋', label: 'Subcontracting' },
};

function getClauseIcon(clauseType = '') {
  const lower = clauseType.toLowerCase();
  for (const [key, val] of Object.entries(CLAUSE_ICONS)) {
    if (lower.includes(key)) return val;
  }
  return { icon: '📜', label: 'Contract Clause' };
}

// ─── Plain-English Summary (one line) ────────────────────────────────────────
function getPlainSummary(clauseType = '', rawExplanation = '') {
  const lower = clauseType.toLowerCase();

  if (lower.includes('payment') || lower.includes('billing') || lower.includes('fee'))
    return 'Payment obligations may be unclear or favor one party.';
  if (lower.includes('terminat'))
    return 'Either party can end the agreement; conditions may be one-sided.';
  if (lower.includes('confidential') || lower.includes('privacy'))
    return 'You may be required to keep certain information strictly private.';
  if (lower.includes('liabilit') || lower.includes('limitation'))
    return 'The company limits how much it owes you if something goes wrong.';
  if (lower.includes('indemnif') || lower.includes('indemnity'))
    return 'You may have to cover their legal costs even for their mistakes.';
  if (lower.includes('intellectual') || lower.includes('copyright') || lower.includes(' ip'))
    return 'Ownership of your work or ideas may transfer to the other party.';
  if (lower.includes('arbitration') || lower.includes('dispute'))
    return 'Any disagreement must be settled privately—not in a public court.';
  if (lower.includes('governing') || lower.includes('jurisdiction'))
    return 'Legal disputes must be handled in a location they choose.';
  if (lower.includes('warranty') || lower.includes('disclaimer'))
    return 'The service is provided as-is with no guarantees of performance.';
  if (lower.includes('renewal') || lower.includes('auto'))
    return 'The contract renews automatically; you must cancel before the deadline.';
  if (lower.includes('force') || lower.includes('majeure'))
    return 'Neither party is liable for failures caused by unforeseen events.';

  if (rawExplanation && !isApiError(rawExplanation)) {
    const first = rawExplanation.split(/[.!?\n]/)[0]?.trim();
    if (first && first.length > 15) return first + '.';
  }
  return 'Review these terms carefully before signing the agreement.';
}

// ─── API Error Detector ───────────────────────────────────────────────────────
function isApiError(text = '') {
  if (!text) return false;
  const t = text.toLowerCase();
  return (
    t.includes('resource_exhausted') ||
    t.includes('quota exceeded') ||
    t.includes('429') ||
    t.includes('rate limit') ||
    t.includes('api_key') ||
    t.includes('internal server error')
  );
}

// ─── Risk Config ──────────────────────────────────────────────────────────────
const RISK_CONFIG = {
  High: {
    badge:       'bg-rose-100 text-rose-700 border-rose-200',
    leftBorder:  'border-l-rose-400',
    dot:         'bg-rose-400',
    emoji:       '🔴',
    rec:         'Review this clause carefully before signing.',
  },
  Medium: {
    badge:       'bg-amber-100 text-amber-700 border-amber-200',
    leftBorder:  'border-l-amber-400',
    dot:         'bg-amber-400',
    emoji:       '🟠',
    rec:         'Consider negotiating this clause.',
  },
  Low: {
    badge:       'bg-emerald-100 text-emerald-700 border-emerald-200',
    leftBorder:  'border-l-emerald-400',
    dot:         'bg-emerald-400',
    emoji:       '🟢',
    rec:         'No major concerns detected.',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function RiskCard({
  title,
  description,
  riskLevel,
  clauseText,
  detectedCount = 1,
  clauses = []
}) {
  const [open, setOpen] = useState(false);
  const level = riskLevel || 'Low';
  const config = RISK_CONFIG[level] || RISK_CONFIG.Low;
  const { icon, label } = getClauseIcon(title);
  const summary = getPlainSummary(title, description);

  const safeDescription = isApiError(description)
    ? 'The AI analysis engine is temporarily unavailable. Please re-upload the document to generate a full legal explanation.'
    : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={`bg-white border border-slate-200/60 border-l-4 ${config.leftBorder} rounded-[16px] shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
    >
      {/* ── Main Row ──────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 p-5 sm:p-6">

        {/* Clause icon */}
        <div className="w-10 h-10 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl">
          {icon}
        </div>

        {/* Title + summary */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-extrabold text-slate-800 leading-tight">{title || label}</p>
            {detectedCount > 1 && (
              <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-indigo-50 text-[#5B5FFF] border border-indigo-100/50">
                {detectedCount} Clauses Detected
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 leading-snug line-clamp-2">{summary}</p>
        </div>

        {/* Risk badge + chevron */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full border uppercase tracking-wider whitespace-nowrap ${config.badge}`}>
            {config.emoji} {level} Risk
          </span>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-[#5B5FFF] transition-colors"
          >
            {detectedCount > 1 ? `View All ${detectedCount} Clauses` : 'View Details'}{' '}
            {open ? <FiChevronUp size={11} /> : <FiChevronDown size={11} />}
          </button>
        </div>
      </div>

      {/* ── Expandable Details ────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="border-t border-slate-100"
          >
            <div className="px-5 sm:px-6 py-5 space-y-6">

              {clauses && clauses.length > 0 ? (
                /* Grouped view: loops over child clauses */
                <div className="space-y-6">
                  {clauses.map((c, i) => {
                    const cLevel = c.risk_level || 'Low';
                    const cConfig = RISK_CONFIG[cLevel] || RISK_CONFIG.Low;
                    const cExpl = isApiError(c.ai_explanation)
                      ? 'The AI analysis engine is temporarily unavailable.'
                      : c.ai_explanation;

                    return (
                      <div key={i} className="space-y-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-[10px] font-extrabold text-slate-700">
                            Occurrence #{c.clause_number || (i + 1)}
                          </p>
                          <div className="flex items-center gap-2.5">
                            <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded-full border uppercase tracking-wider ${cConfig.badge}`}>
                              {cConfig.emoji} {cLevel} Risk
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">
                              Score: {Math.round(c.risk_score)}%
                            </span>
                          </div>
                        </div>

                        {/* Original text */}
                        {c.clause_text && (
                          <div className="space-y-1">
                            <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                              Original Clause Text
                            </p>
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                              <p className="text-[10px] text-slate-600 leading-relaxed font-mono">
                                {c.clause_text}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* AI Explanation */}
                        {cExpl && (
                          <div className="space-y-1">
                            <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                              AI Analysis
                            </p>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                              {cExpl}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Fallback single-clause view (original structure fully preserved) */
                <div className="space-y-4">
                  {clauseText && (
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                        Original Clause
                      </p>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                          {clauseText}
                        </p>
                      </div>
                    </div>
                  )}

                  {safeDescription && (
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                        AI Analysis
                      </p>
                      <p className="text-[12px] text-slate-600 leading-relaxed">
                        {safeDescription}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* General recommendation summary */}
              <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${
                level === 'High'   ? 'bg-rose-50 border-rose-100/60' :
                level === 'Medium' ? 'bg-amber-50 border-amber-100/60' :
                                     'bg-emerald-50 border-emerald-100/60'
              }`}>
                <span className="text-sm flex-shrink-0">{config.emoji}</span>
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                    Category Recommendation
                  </p>
                  <p className={`text-[11px] font-semibold mt-0.5 ${
                    level === 'High'   ? 'text-rose-700' :
                    level === 'Medium' ? 'text-amber-700' :
                                         'text-emerald-700'
                  }`}>
                    {config.rec}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}