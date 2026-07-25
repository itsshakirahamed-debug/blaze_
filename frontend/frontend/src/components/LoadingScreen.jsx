import { motion } from 'framer-motion';

export default function LoadingScreen() {
  const steps = [
    { label: 'Analyzing Contract...', icon: '📄' },
    { label: 'Extracting Text...', icon: '📝' },
    { label: 'Classifying Clauses...', icon: '📋' },
    { label: 'Calculating Risk...', icon: '⚠️' },
    { label: 'Generating AI Explanation...', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Analyzing Your Contract
          </h1>
          <p className="text-lg text-slate-600">
            Our AI is working hard to analyze your document...
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4"
            >
              {/* Icon */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1,
                  delay: idx * 0.1,
                  repeat: Infinity,
                }}
                className="text-3xl"
              >
                {step.icon}
              </motion.div>

              {/* Text */}
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{step.label}</p>
              </div>

              {/* Progress indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                className="flex gap-1"
              >
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    animate={{
                      backgroundColor: ['#cbd5e1', '#0ea5e9', '#cbd5e1'],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: dot * 0.2,
                      repeat: Infinity,
                    }}
                    className="w-2 h-2 rounded-full bg-slate-300"
                  ></motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-900">Overall Progress</span>
            <motion.span
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-sm font-semibold text-sky-600"
            >
              In Progress...
            </motion.span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: ['0%', '30%', '60%', '85%'] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
            ></motion.div>
          </div>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <div className="inline-flex gap-1">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                animate={{
                  y: [-8, 0, -8],
                }}
                transition={{
                  duration: 0.6,
                  delay: dot * 0.15,
                  repeat: Infinity,
                }}
                className="w-3 h-3 rounded-full bg-sky-600"
              ></motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
