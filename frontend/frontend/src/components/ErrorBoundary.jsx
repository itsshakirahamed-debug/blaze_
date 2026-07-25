import { motion } from 'framer-motion';

export default function ErrorBoundary({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-red-200 max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-900 mb-4">Oops! Something went wrong</h2>
        <p className="text-red-700 mb-6">
          We encountered an error. Please try refreshing the page or contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </motion.div>
  );
}
