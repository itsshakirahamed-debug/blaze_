import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import DragDropUpload from '@components/DragDropUpload';
import ModelSelector from '@components/ModelSelector';

const MODE_STEPS = {
  fast: [
    { label: 'Running document checks...', icon: '📄' },
    { label: 'ML clause classification...', icon: '🤖' },
    { label: 'ML risk scoring...', icon: '📊' },
    { label: 'Smart-skipping low-risk clauses...', icon: '⚡' },
    { label: 'Finalizing authenticity audit...', icon: '🛡️' },
  ],
  balanced: [
    { label: 'Running document checks...', icon: '📄' },
    { label: 'Extracting text layouts...', icon: '📝' },
    { label: 'ML clause classification...', icon: '🤖' },
    { label: 'Parallel Gemini explanations...', icon: '⚖️' },
    { label: 'Running authenticity audit...', icon: '🛡️' },
  ],
  deep: [
    { label: 'Running document checks...', icon: '📄' },
    { label: 'Extracting text layouts...', icon: '📝' },
    { label: 'Full Gemini clause analysis...', icon: '🔬' },
    { label: 'Generating executive summary...', icon: '💡' },
    { label: 'Building negotiation suggestions...', icon: '🤝' },
  ],
};

const MODE_LABELS = {
  fast:     '⚡ Fast Mode',
  balanced: '⚖️ Balanced',
  deep:     '🔬 Deep Analysis',
};

export default function Upload() {
  const [file, setFile] = useState(null);
  const [selectedMode, setSelectedMode] = useState('balanced');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', selectedMode);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      let response;

      try {
        response = await fetch(`${baseUrl}/analyze`, {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        response = await fetch('http://localhost:8000/analyze', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis failed (${response.status}): ${errorText || 'Server Error'}`);
      }

      const result = await response.json();
      result._mode = selectedMode;
      localStorage.setItem('analysisResult', JSON.stringify(result));
      navigate('/results');
    } catch (error) {
      console.error('ERROR during analysis:', error);
      alert(`Backend Analysis Error: ${error.message || 'Unable to connect to analysis server. Ensure backend API is running on port 8000.'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };


  // ── Loading screen ──
  if (isAnalyzing) {
    const steps = MODE_STEPS[selectedMode] || MODE_STEPS.balanced;
    const modeLabel = MODE_LABELS[selectedMode] || 'Analyzing';

    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-[#FAFBFF]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: 460,
            width: '100%',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 20,
            padding: 36,
            boxShadow: '0 8px 30px rgba(15,23,42,0.06)',
          }}
        >
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: '#5B5FFF', background: '#eef2ff', padding: '4px 12px', borderRadius: 999,
            }}>
              {modeLabel}
            </span>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Analyzing Contract
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
              Running verification checks and AI intelligence audits.
            </p>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 16 }}>{step.icon}</span>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{step.label}</p>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      animate={{ backgroundColor: ['#e2e8f0', '#5B5FFF', '#e2e8f0'] }}
                      transition={{ duration: 1.5, delay: dot * 0.2 + idx * 0.1, repeat: Infinity }}
                      style={{ width: 6, height: 6, borderRadius: '50%' }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>
              <span>OVERALL HEALTH CHECKS</span>
              <span style={{ color: '#5B5FFF' }} className="animate-pulse">RUNNING</span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: ['0%', '20%', '50%', '80%', '95%'] }}
                transition={{ duration: selectedMode === 'fast' ? 4 : selectedMode === 'deep' ? 10 : 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ height: '100%', background: '#5B5FFF', borderRadius: 999 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Main upload page ──
  return (
    <div className="min-h-[85vh] bg-[#FAFBFF] py-16 flex items-start justify-center">
      <div style={{ maxWidth: 640, width: '100%', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
        >
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#5B5FFF', background: '#eef2ff', padding: '4px 12px', borderRadius: 999 }}>
            Analysis Dashboard
          </span>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', lineHeight: 1.2 }}>
            Upload Your Contract
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, maxWidth: 440, fontWeight: 500 }}>
            Drag-and-drop any PDF or DOCX file to instantly compute authenticity scores and clause risk metrics.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* File upload */}
          <motion.div variants={itemVariants}>
            <DragDropUpload onFileSelect={handleFileSelect} />
          </motion.div>

          {/* Model Selector */}
          <motion.div
            variants={itemVariants}
            style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 8px 30px rgba(15,23,42,0.04)',
            }}
          >
            <ModelSelector selectedMode={selectedMode} onModeChange={setSelectedMode} />
          </motion.div>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            className="sm:flex-row sm:justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAnalyze}
              disabled={!file}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '14px 28px',
                background: file ? '#0f172a' : '#f1f5f9',
                color: file ? '#fff' : '#94a3b8',
                fontSize: 14, fontWeight: 700,
                borderRadius: 12, border: 'none',
                cursor: file ? 'pointer' : 'not-allowed',
                boxShadow: file ? '0 4px 16px rgba(15,23,42,0.18)' : 'none',
                whiteSpace: 'nowrap',
                transition: 'all 200ms ease',
              }}
            >
              Analyze Contract <FiArrowRight size={15} />
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              href="/"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '14px 28px',
                background: '#fff', color: '#334155',
                fontSize: 14, fontWeight: 700,
                borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                transition: 'all 200ms ease',
              }}
            >
              Back to Home
            </motion.a>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
