import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.09, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="relative w-full min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#FAFBFF] py-20 lg:py-28">

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.45,
        }}
      />

      {/* Soft radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 760,
          height: 520,
          background: 'radial-gradient(ellipse at center, rgba(91,95,255,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-[1280px] mx-auto px-8 z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Copy ── */}
          <div className="space-y-7 text-left">

            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex">
              <span
                style={{ fontSize: 10, letterSpacing: '0.1em', borderRadius: 999, padding: '6px 16px' }}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200/70 text-[#5B5FFF] font-extrabold uppercase shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#5B5FFF] animate-pulse flex-shrink-0" />
                AI-Powered Contract Intelligence
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em' }}
              className="text-slate-900"
            >
              Verify Contracts<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #5B5FFF 0%, #7f83ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                In Under 3 Seconds
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              style={{ fontSize: 15, lineHeight: 1.75, maxWidth: 480 }}
              className="text-slate-500 font-medium"
            >
              Upload any contract and instantly verify authenticity, detect risky legal clauses, explain legal terms in plain English, and receive AI-powered recommendations before signing.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-1">
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 bg-[#5B5FFF] hover:bg-[#4a4deb] text-white font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200/60"
                style={{ borderRadius: 12, fontSize: 14, padding: '14px 28px', whiteSpace: 'nowrap' }}
              >
                Analyze Contract <FiArrowRight size={15} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold transition-all duration-200"
                style={{ borderRadius: 12, fontSize: 14, padding: '14px 28px', whiteSpace: 'nowrap' }}
              >
                Learn More
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-5 pt-1">
              {['AI Powered', 'Secure Processing', 'Accurate Results'].map((label) => (
                <span key={label} className="flex items-center gap-1.5 text-slate-500 font-semibold" style={{ fontSize: 12 }}>
                  <FiCheck size={13} className="text-emerald-500 flex-shrink-0" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Dashboard Mockup ── */}
          <motion.div
            variants={itemVariants}
            className="relative w-full flex items-center justify-center"
            style={{ minHeight: 440 }}
          >
            {/* Main backdrop card */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(145deg, #f8faff 0%, #eef0ff 100%)',
                borderRadius: 28,
                border: '1px solid rgba(91,95,255,0.12)',
                boxShadow: '0 24px 80px rgba(15,23,42,0.10)',
                transform: 'rotate(-1deg) scale(0.98)',
              }}
            />

            {/* ── Widget 1: Contract Preview (top-left) ── */}
            <motion.div
              initial={{ opacity: 0, x: -16, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.35, duration: 0.55 }}
              style={{
                position: 'absolute',
                top: 28,
                left: 16,
                width: 230,
                background: '#fff',
                borderRadius: 16,
                border: '1px solid rgba(148,163,184,0.2)',
                boxShadow: '0 8px 30px rgba(15,23,42,0.07)',
                padding: 16,
                zIndex: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CONTRACT_AGREEMENT.PDF</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[0.85, 1, 0.65].map((w, i) => (
                  <div key={i} style={{ height: 7, background: '#f1f5f9', borderRadius: 4, width: `${w * 100}%` }} />
                ))}
                <div style={{ padding: '6px 8px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 6, marginTop: 2 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#e11d48' }}>🚨 Predatory Indemnity Clause Detected</span>
                </div>
              </div>
            </motion.div>

            {/* ── Widget 2: Verification Score (top-right) ── */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
              style={{
                position: 'absolute',
                top: 20,
                right: 16,
                width: 168,
                background: '#fff',
                borderRadius: 16,
                border: '1px solid rgba(148,163,184,0.2)',
                boxShadow: '0 8px 30px rgba(15,23,42,0.07)',
                padding: 16,
                zIndex: 30,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 8.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'flex-start' }}>Verification Score</span>
              <div style={{ position: 'relative', width: 68, height: 68 }}>
                <svg width="68" height="68" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#5B5FFF" strokeWidth="3"
                    strokeDasharray="100" strokeDashoffset="26" strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#1e293b' }}>74%</div>
              </div>
              <p style={{ fontSize: 8, color: '#94a3b8', textAlign: 'center', fontWeight: 500 }}>Standard compliance layout verified</p>
            </motion.div>

            {/* ── Widget 3: Compliance Chart (bottom-right) ── */}
            <motion.div
              initial={{ opacity: 0, x: 16, y: 16 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.55, duration: 0.55 }}
              style={{
                position: 'absolute',
                bottom: 24,
                right: 16,
                width: 210,
                background: '#fff',
                borderRadius: 16,
                border: '1px solid rgba(148,163,184,0.2)',
                boxShadow: '0 8px 30px rgba(15,23,42,0.07)',
                padding: 16,
                zIndex: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Compliance Index</span>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: '#10b981' }}>HEALTHY</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 5, height: 60 }}>
                {[40, 70, 45, 90, 60, 85].map((val, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', background: i === 3 ? '#5B5FFF' : '#e0e7ff', height: `${val}%` }} />
                ))}
              </div>
            </motion.div>

            {/* ── Widget 4: Company Verified badge (bottom-left) ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65, duration: 0.45 }}
              style={{
                position: 'absolute',
                bottom: 40,
                left: 20,
                background: '#0f172a',
                borderRadius: 14,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                zIndex: 30,
                boxShadow: '0 8px 24px rgba(15,23,42,0.28)',
              }}
            >
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>✓</span>
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>Delaware TAX ID</p>
                <p style={{ fontSize: 8, fontWeight: 500, color: '#64748b', lineHeight: 1, marginTop: 3 }}>Company Verified</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
