export function FraudFlagsCard({ fraudFlags = [] }) {
  return (
    <div className="bg-white p-7 sm:p-8 rounded-lg border border-slate-200/70 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="px-2 py-1 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-3.5">
          <span>⚠️</span> Fraud Flags
        </h3>
        {fraudFlags.length === 0 ? (
          <div className="p-4 px-4 py-3.5 bg-emerald-50/70 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-md flex items-center gap-2.5">
            <span className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
            <span>No suspicious risk signals found.</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {fraudFlags.map((flag, idx) => (
              <div key={idx} className="p-3.5 px-4 bg-rose-50 border border-rose-100 rounded-md flex items-start gap-2.5 text-xs font-bold text-rose-800">
                <span className="flex-shrink-0 mt-0.5">🚨</span>
                <span>{flag}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ClauseChecklistCard({ missingClauses = [] }) {
  const mandatoryClauseList = [
    "Payment",
    "Termination",
    "Liability",
    "Confidentiality",
    "Governing Law",
    "Dispute Resolution",
    "Force Majeure",
    "Intellectual Property"
  ];

  const isMissing = (clauseName) => {
    if (!missingClauses || missingClauses.length === 0) return false;
    const lowerMissing = missingClauses.map(c => String(c).toLowerCase());
    const lowerName = clauseName.toLowerCase();
    return lowerMissing.some(m => m.includes(lowerName) || lowerName.includes(m));
  };

  return (
    <div className="bg-white p-7 sm:p-8 rounded-lg border border-slate-200/70 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="px-2 py-1 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-3.5">
          <span className="text-indigo-500">📑</span> Clause Checklist
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs font-bold text-slate-700 px-1">
          {mandatoryClauseList.map((clauseName, idx) => {
            const missing = isMissing(clauseName);
            return (
              <div key={idx} className="flex items-center justify-between py-1 px-1">
                <span className="text-slate-800">{clauseName}</span>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                  missing ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {missing ? 'MISSING' : 'OK'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function InternalConsistencyCard({ contradictions = [] }) {
  const hasContradictions = contradictions.length > 0;

  return (
    <div className="bg-white p-7 sm:p-8 rounded-lg border border-slate-200/70 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="px-2 py-1 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-3.5">
          <span className="text-indigo-500">🔍</span> Internal Consistency
        </h3>
        {hasContradictions ? (
          <div className="p-4 px-4 py-3.5 bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs font-semibold rounded-md flex items-start gap-2.5">
            <span className="text-amber-600 flex-shrink-0 mt-0.5">⚠️</span>
            <div className="space-y-1">
              {contradictions.map((c, i) => (
                <p key={i}>{c}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 px-4 py-3.5 bg-emerald-50/70 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-md flex items-center gap-2.5">
            <span className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
            <span>Internal clauses align cleanly.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FraudFlagsPanel({ missingClauses = [], contradictions = [], fraudFlags = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
      <FraudFlagsCard fraudFlags={fraudFlags} />
      <ClauseChecklistCard missingClauses={missingClauses} />
      <InternalConsistencyCard contradictions={contradictions} />
    </div>
  );
}
