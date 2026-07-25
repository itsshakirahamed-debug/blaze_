import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block"
        >
          <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full"></div>
        </motion.div>
        <p className="mt-4 text-slate-600 font-semibold">Loading...</p>
      </div>
    </motion.div>
  );
}
