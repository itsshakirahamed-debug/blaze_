import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ClauseTypeChart({ analysis = [] }) {
  const grouped = {};

  analysis.forEach((item) => {
    const type = item.clause_type;
    if (!grouped[type]) {
      grouped[type] = {
        name: type,
        totalScore: 0,
        count: 0,
      };
    }
    grouped[type].count += 1;
    grouped[type].totalScore += Number(item.risk_score);
  });

  const data = Object.values(grouped).map((item) => ({
    name: item.name,
    risk: Math.round(item.totalScore / item.count),
    count: item.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-[16px] p-8 border border-slate-200/60 shadow-sm flex flex-col justify-between h-full space-y-4"
    >
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
          Legal Metrics
        </span>
        <h3 className="text-sm font-bold text-slate-800 mt-1">
          Risk by Clause Type
        </h3>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -30,
              bottom: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              angle={-25}
              textAnchor="end"
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              interval={0}
              height={50}
            />
            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
            <Tooltip
              formatter={(value) => [`${value}%`, "Avg Risk"]}
              contentStyle={{
                backgroundColor: '#1e293b',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '11px',
                border: 'none',
              }}
            />
            <Bar dataKey="risk" fill="#5B5FFF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-slate-50">
        {data.slice(0, 6).map((item, idx) => (
          <div key={idx} className="p-2 bg-slate-50/50 border border-slate-100/50 rounded-xl">
            <p className="text-[9px] font-bold text-slate-400 truncate">{item.name}</p>
            <div className="flex justify-between items-end mt-1">
              <span className="text-xs font-extrabold text-slate-750">{item.risk}%</span>
              <span className="text-[8px] font-semibold text-slate-400">Qty: {item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}