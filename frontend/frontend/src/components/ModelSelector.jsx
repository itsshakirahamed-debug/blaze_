import { motion } from 'framer-motion';
import { FiZap, FiSliders, FiSearch } from 'react-icons/fi';

const MODES = [
  {
    id: 'fast',
    icon: FiZap,
    emoji: '⚡',
    label: 'Fast Mode',
    tagline: '~5–10 seconds',
    description: 'ML classifier + Smart Gemini Skip. Skips Gemini for low-risk clauses and returns instant template explanations.',
    features: ['TF-IDF + LR Classifier', 'ML Risk Scorer', 'Smart Skip (~40% fewer API calls)', 'Parallel execution'],
    color: {
      ring:   'ring-2 ring-emerald-400',
      border: '#6ee7b7',
      bg:     'rgba(236,253,245,0.7)',
      badge:  { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
      icon:   '#059669',
      iconBg: '#d1fae5',
      label:  '#065f46',
    },
    recommended: false,
  },
  {
    id: 'balanced',
    icon: FiSliders,
    emoji: '⚖️',
    label: 'Balanced',
    tagline: '~15–25 seconds',
    description: 'ML models for classification + full parallel Gemini explanations for every clause. Best of both worlds.',
    features: ['TF-IDF + LR Classifier', 'ML Risk Scorer', 'Full Gemini (parallel)', 'AI Intelligence'],
    color: {
      ring:   'ring-2 ring-[#5B5FFF]',
      border: '#5B5FFF',
      bg:     'rgba(238,242,255,0.7)',
      badge:  { bg: '#eef2ff', color: '#3730a3', border: '#c7d2fe' },
      icon:   '#5B5FFF',
      iconBg: '#e0e7ff',
      label:  '#5B5FFF',
    },
    recommended: false,
  },
  {
    id: 'deep',
    icon: FiSearch,
    emoji: '🔬',
    label: 'Deep Analysis',
    tagline: '~30–60 seconds',
    description: 'Full Gemini on every clause with richer prompts, plus Executive Summary, Recommendation, and Negotiation Suggestions.',
    features: ['ML Classifier + Risk Scorer', 'Full Gemini (every clause)', 'Executive Summary', 'Negotiation Suggestions'],
    color: {
      ring:   'ring-2 ring-rose-400',
      border: '#fca5a5',
      bg:     'rgba(255,241,242,0.7)',
      badge:  { bg: '#fff1f2', color: '#9f1239', border: '#fecdd3' },
      icon:   '#e11d48',
      iconBg: '#ffe4e6',
      label:  '#be123c',
    },
    recommended: false,
  },
];

export default function ModelSelector({ selectedMode, onModeChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>
          Analysis Mode
        </span>
      </div>

      {/* Mode Cards — always 3 equal columns on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              style={{
                position: 'relative',
                textAlign: 'left',
                padding: 16,
                borderRadius: 16,
                border: isSelected ? `1.5px solid ${mode.color.border}` : '1px solid rgba(0,0,0,0.07)',
                background: isSelected ? mode.color.bg : '#fff',
                boxShadow: isSelected ? `0 0 0 3px ${mode.color.border}30` : '0 2px 8px rgba(15,23,42,0.04)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'all 150ms ease',
              }}
            >
              {/* Recommended pill */}
              {mode.recommended && (
                <span style={{
                  position: 'absolute', top: 10, right: 10,
                  fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                  padding: '2px 6px', borderRadius: 999,
                  background: '#5B5FFF', color: '#fff',
                }}>
                  Recommended
                </span>
              )}

              {/* Icon + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: isSelected ? mode.color.iconBg : '#f1f5f9',
                }}>
                  <Icon size={15} style={{ color: isSelected ? mode.color.icon : '#94a3b8' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: isSelected ? mode.color.label : '#1e293b', lineHeight: 1.2 }}>
                    {mode.label}
                  </p>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>{mode.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, fontWeight: 500 }}>
                {mode.description}
              </p>

              {/* Feature list */}
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {mode.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                      background: isSelected ? mode.color.icon : '#cbd5e1',
                    }} />
                    <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Selected check */}
              {isSelected && (
                <motion.div
                  layoutId="mode-indicator"
                  style={{
                    position: 'absolute', bottom: 10, right: 10,
                    width: 20, height: 20, borderRadius: '50%',
                    background: mode.color.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 800, color: mode.color.icon }}>✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
