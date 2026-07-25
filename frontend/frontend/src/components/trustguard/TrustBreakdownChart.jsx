import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

export default function TrustBreakdownChart({ breakdown }) {
  const defaultBreakdown = {
    metadata_score: 100,
    duplicate_score: 100,
    signature_score: 25,
    ocr_score: 100,
    company_score: 100,
    missing_clauses_score: 60,
    consistency_score: 74,
    consistency_2_score: 80,
    fraud_pattern_score: 100,
    template_score: 78,
    layout_score: 100,
  };

  const data = breakdown || defaultBreakdown;

  const chartData = [
    { name: 'Metadata', score: data.metadata_score },
    { name: 'Duplicate', score: data.duplicate_score },
    { name: 'Signature', score: data.signature_score },
    { name: 'OCR Integrity', score: data.ocr_score },
    { name: 'Company', score: data.company_score },
    { name: 'Clauses', score: data.missing_clauses_score },
    { name: 'Consistency', score: data.consistency_score },
    { name: 'Fraud Check', score: data.fraud_pattern_score },
    { name: 'Template', score: data.template_score },
    { name: 'Layout', score: data.layout_score },
  ];

  const getColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Amber
    return '#f43f5e'; // Red
  };

  return (
    <div className="bg-white p-7 sm:p-8 rounded-lg border border-slate-200/70 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="px-2 py-1 space-y-4">
        {/* Header */}
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            📊 Multi-Layer Scoring
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            Trust Breakdown
          </h3>
        </div>

        {/* Chart Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                angle={-30}
                textAnchor="end"
                interval={0}
                height={45}
              />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 9, fill: '#64748b' }} />
              <Tooltip
                formatter={(value) => [`${value}/100`, 'Health Score']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '6px',
                  fontSize: '11px',
                  border: 'none',
                  padding: '8px 12px',
                }}
              />
              <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Center Aligned Color Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
            <span>Safe / Good (≥80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
            <span>Needs Review (50–79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
            <span>Poor / Risky (&lt;50)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
