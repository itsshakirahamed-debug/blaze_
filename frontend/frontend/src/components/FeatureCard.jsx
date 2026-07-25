import { motion } from 'framer-motion';

const CARD_SHADOW = '0 8px 30px rgba(15,23,42,0.06)';
const CARD_HOVER_SHADOW = '0 16px 48px rgba(15,23,42,0.12)';

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: CARD_HOVER_SHADOW }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 20,
        boxShadow: CARD_SHADOW,
        padding: '28px 28px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 18,
        cursor: 'default',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'rgba(91,95,255,0.08)',
          border: '1px solid rgba(91,95,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={18} style={{ color: '#5B5FFF' }} />
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
          {title}
        </h3>
        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.68, fontWeight: 500 }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}
