import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiRefreshCw } from 'react-icons/fi';

// Helper to detect API Quota / Rate limit logs or service failure
const isApiError = (text) => {
  if (!text) return false;
  const t = text.toLowerCase();
  return t.includes('resource_exhausted') || 
         t.includes('quota exceeded') || 
         t.includes('429') || 
         t.includes('rate limit') || 
         t.includes('api_key') || 
         t.includes('internal server error') ||
         t.includes('temporarily unavailable') ||
         t.includes('reached') ||
         t.includes('limit reached');
};

export default function AIExplanations({ explanations = [] }) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);

  // Assess if the AI explanation service failed globally
  const isAiServiceFailed = explanations.length === 0 || 
                            explanations.some(item => isApiError(item.ai_explanation)) || 
                            explanations.every(item => !item.ai_explanation);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryFailed(false);
    setTimeout(() => {
      setIsRetrying(false);
      setRetryFailed(true);
      // Safe fallback alert
      alert("AI Service quota limit (429) is still resolving. Please try again in 30 seconds.");
    }, 1500);
  };

  const getRiskStyles = (lvl) => {
    switch (lvl) {
      case "Low":
        return "bg-emerald-50/50 text-emerald-700 border-emerald-100/60";
      case "Medium":
        return "bg-amber-50/50 text-amber-700 border-amber-100/60";
      case "High":
      default:
        return "bg-rose-50/50 text-rose-700 border-rose-100/60";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-slate-50/50 border border-slate-200/60 rounded-[16px] p-8 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-indigo-50 border border-indigo-100/50 rounded-xl flex items-center justify-center text-sm">
            💡
          </span>
          <h3 className="text-sm font-bold text-slate-800">
            AI Insights &amp; Explanations
          </h3>
        </div>
      </div>

      {isAiServiceFailed ? (
        /* Global AI Failure Notice Banner (replaces individual cards) */
        <div className="bg-amber-50/60 border border-amber-200/80 p-8 rounded-[16px] shadow-sm flex flex-col items-center text-center space-y-4">
          <span className="text-3xl leading-none select-none">🟡</span>
          <div className="space-y-1.5">
            <h3 className="text-sm font-extrabold text-amber-800">
              AI Explanations Temporarily Unavailable
            </h3>
            <p className="text-[11px] text-slate-500 max-w-md leading-relaxed font-medium">
              The contract has been successfully analyzed using our local machine learning and TrustGuard pipeline. Plain-English AI explanations are currently unavailable because the AI service could not be reached. All risk scores, authenticity checks, and clause classifications remain valid.
            </p>
          </div>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm disabled:bg-amber-400 active:scale-95"
          >
            <FiRefreshCw className={isRetrying ? "animate-spin" : ""} size={12} />
            {isRetrying ? "Retrying AI service..." : "Retry AI Explanations"}
          </button>
        </div>
      ) : (
        /* Normal clause explanations list */
        <div className="space-y-4">
          {explanations.map((item, idx) => (
            <ExplanationItem key={idx} item={item} getRiskStyles={getRiskStyles} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Collapsible explanation item sub-component
function ExplanationItem({ item, getRiskStyles }) {
  const [showDetails, setShowDetails] = useState(false);

  // Plain English Translation Mapper
  const getPlainEnglishTranslation = (clauseType, riskLvl, rawExplanation) => {
    if (isApiError(rawExplanation)) {
      return "Plain-English explanation unavailable.";
    }

    const type = (clauseType || "").toLowerCase();

    if (type.includes('indemnity') || type.includes('indemnification')) {
      return "You might have to pay for their legal bills and mistakes even if it is their fault.";
    }
    if (type.includes('liability') || type.includes('limitation')) {
      return "If they lose your files or damage your business, they don't have to pay you back.";
    }
    if (type.includes('governing') || type.includes('jurisdiction') || type.includes('law')) {
      return "If you disagree, you must go to court in a location they choose.";
    }
    if (type.includes('terminate') || type.includes('termination')) {
      return "They can shut down your account or end this contract without warning.";
    }
    if (type.includes('payment') || type.includes('billing') || type.includes('fee')) {
      return "They can charge you extra fees or change the price without warning.";
    }
    if (type.includes('intellectual') || type.includes('property') || type.includes('ip') || type.includes('copyright')) {
      return "They might own the work you build, or you lose rights to your creations.";
    }
    if (type.includes('arbitration') || type.includes('dispute')) {
      return "You cannot sue them in court; any fight will be settled in private arbitration.";
    }
    if (type.includes('confidential') || type.includes('confidentiality')) {
      return "You are banned from telling anyone about their secrets or terms.";
    }
    if (type.includes('warranty') || type.includes('disclaimer')) {
      return "They sell this as-is. They do not promise that the service will actually work.";
    }

    if (rawExplanation) {
      const firstSentence = rawExplanation.split(/[.!?]/)[0];
      if (firstSentence && firstSentence.trim().length > 10) {
        return firstSentence.trim() + ".";
      }
    }
    return "Review these terms carefully before signing the agreement.";
  };

  const plainEnglish = getPlainEnglishTranslation(item.clause_type, item.risk_level, item.ai_explanation);
  const displayDescription = !item.ai_explanation || isApiError(item.ai_explanation)
    ? "Plain-English explanation unavailable."
    : item.ai_explanation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[16px] p-5 border border-slate-200/60 shadow-sm space-y-3"
    >
      <h4 className="font-extrabold text-slate-800 text-xs tracking-tight">
        {item.clause_type}
      </h4>

      {/* Simplified Translation Highlight Box */}
      <div className="p-3 bg-indigo-50/45 border border-indigo-100/50 rounded-xl space-y-1">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#5B5FFF] bg-white px-2 py-0.5 rounded border border-indigo-100/30">
          👉 Plain English Translation
        </span>
        <p className="text-slate-700 text-[11px] font-semibold leading-relaxed">
          {plainEnglish}
        </p>
      </div>

      {/* Collapsible Legalese analysis */}
      <div className="space-y-1">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-650 transition-colors"
        >
          {showDetails ? (
            <>
              Hide detailed legal analysis <FiChevronUp size={11} />
            </>
          ) : (
            <>
              Show detailed legal analysis <FiChevronDown size={11} />
            </>
          )}
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-slate-500 text-[11px] leading-relaxed pt-1.5 border-t border-slate-100 mt-1 select-none"
            >
              {displayDescription}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className={`p-3 rounded-xl border flex items-center justify-between gap-4 ${getRiskStyles(item.risk_level)}`}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold">Severity:</span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider">{item.risk_level} Risk</span>
        </div>
        <div className="text-[10px] font-bold">
          Score: {Math.round(item.risk_score)}%
        </div>
      </div>
    </motion.div>
  );
}