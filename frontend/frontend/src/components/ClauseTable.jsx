import { motion } from 'framer-motion';

export default function ClauseTable({ clauses = [] }) {
  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case "Low":
        return "bg-emerald-50 text-emerald-700 border-emerald-100/50";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-100/50";
      case "High":
      default:
        return "bg-rose-50 text-rose-700 border-rose-100/50";
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      Payment: "bg-blue-50 text-blue-700 border-blue-100/40",
      Liability: "bg-purple-50 text-purple-700 border-purple-100/40",
      Termination: "bg-orange-50 text-orange-700 border-orange-100/40",
      Confidentiality: "bg-pink-50 text-pink-700 border-pink-100/40",
      Indemnity: "bg-red-50 text-red-700 border-red-100/40",
      Arbitration: "bg-green-50 text-green-700 border-green-100/40",
      Warranty: "bg-cyan-50 text-cyan-700 border-cyan-100/40",
      IntellectualProperty: "bg-indigo-50 text-indigo-700 border-indigo-100/40",
      GoverningLaw: "bg-slate-50 text-slate-700 border-slate-200/40",
    };
    return colors[type] || "bg-slate-50 text-slate-600 border-slate-100";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-x-auto rounded-2xl border border-slate-100 bg-white"
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Clause Type
            </th>
            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Count
            </th>
            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Risk Level
            </th>
            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Risk Score
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100/60">
          {clauses.length > 0 ? (
            clauses.map((clause, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="hover:bg-slate-50/30 transition-colors"
              >
                <td className="px-6 py-3.5">
                  <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-bold ${getTypeColor(clause.type)}`}>
                    {clause.type}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-xs font-bold text-slate-700">
                  {clause.count}
                </td>
                <td className="px-6 py-3.5">
                  <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-bold ${getRiskBadgeColor(clause.risk)}`}>
                    {clause.risk}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-xs font-bold text-slate-800">
                  {Math.round(Number(clause.score))}%
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-8 text-slate-400 text-xs">
                No clauses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}