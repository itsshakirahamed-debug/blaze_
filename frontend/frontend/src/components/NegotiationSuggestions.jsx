import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

function SuggestionItem({ item, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="bg-white border border-slate-200/60 rounded-[16px] overflow-hidden shadow-sm"
    >
      {/* Collapsible header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-6 h-6 bg-rose-50 border border-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FiAlertTriangle className="text-rose-500 w-3 h-3" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{item.clause_type}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">High Risk Clause — Click to view suggestion</p>
          </div>
        </div>
        {open ? <FiChevronUp className="text-slate-400 flex-shrink-0" size={14} /> : <FiChevronDown className="text-slate-400 flex-shrink-0" size={14} />}
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100"
          >
            <div className="p-5 space-y-4">

              {/* Original Clause */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-rose-50 border border-rose-100/60 rounded flex items-center justify-center">
                    <FiAlertTriangle className="text-rose-400 w-2.5 h-2.5" />
                  </span>
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-rose-500">Original Clause</p>
                </div>
                <div className="p-3 bg-rose-50/50 border border-rose-100/60 rounded-xl">
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {item.original_text}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-300 text-sm">↓</div>

              {/* Suggested Clause */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-emerald-50 border border-emerald-100/60 rounded flex items-center justify-center">
                    <FiCheckCircle className="text-emerald-500 w-2.5 h-2.5" />
                  </span>
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600">Suggested Safer Wording</p>
                </div>
                <div className="p-3 bg-emerald-50/50 border border-emerald-100/60 rounded-xl">
                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    {item.suggested_text}
                  </p>
                </div>
              </div>

              {/* AI Explanation */}
              {item.explanation && (
                <div className="p-3 bg-indigo-50/40 border border-indigo-100/50 rounded-xl space-y-1">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#5B5FFF]">💡 Why This Matters</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function NegotiationSuggestions({ suggestions = [] }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      {/* Section header */}
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 bg-rose-50 border border-rose-100/50 rounded-xl flex items-center justify-center text-sm flex-shrink-0">
          🤝
        </span>
        <div>
          <h3 className="text-sm font-bold text-slate-800">AI Negotiation Suggestions</h3>
          <p className="text-[10px] text-slate-400">
            {suggestions.length} high-risk {suggestions.length === 1 ? 'clause' : 'clauses'} — safer alternatives generated by Gemini
          </p>
        </div>
      </div>

      {/* Suggestion Cards */}
      <div className="space-y-3">
        {suggestions.map((item, idx) => (
          <SuggestionItem key={idx} item={item} index={idx} />
        ))}
      </div>
    </motion.div>
  );
}
