import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function RiskDistributionChart({ analysis = [] }) {
  const riskCounts = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  analysis.forEach((item) => {
    if (item.risk_level === "Low") riskCounts.Low++;
    else if (item.risk_level === "Medium") riskCounts.Medium++;
    else riskCounts.High++;
  });

  const data = [
    {
      name: "Low Risk",
      value: riskCounts.Low,
      fill: "#10b981", // Emerald
    },
    {
      name: "Medium Risk",
      value: riskCounts.Medium,
      fill: "#f59e0b", // Amber
    },
    {
      name: "High Risk",
      value: riskCounts.High,
      fill: "#f43f5e", // Rose
    },
  ];

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
          Legal Analysis
        </span>
        <h3 className="text-sm font-bold text-slate-800 mt-1">
          Risk Distribution
        </h3>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '11px',
                border: 'none',
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconSize={8}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', color: '#64748b' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
        {data.map((item, idx) => (
          <div key={idx} className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
              <p className="text-[10px] text-slate-400 font-semibold truncate">{item.name}</p>
            </div>
            <p className="text-lg font-extrabold text-slate-800">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}