import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const CARD_SHADOW = '0 8px 30px rgba(15,23,42,0.08)';
  const CARD_HOVER_SHADOW = '0 16px 48px rgba(15,23,42,0.14)';

  return (
    <div className="min-h-screen bg-[#FAFBFF] w-full flex flex-col items-center">

      {/* ── HERO ── */}
      <section className="w-full max-w-[1200px] mx-auto flex flex-col items-center text-center pt-20 pb-16 px-8">
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <span
              style={{ fontSize: 9, letterSpacing: '0.12em' }}
              className="font-extrabold uppercase tracking-widest text-[#5B5FFF] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100/40"
            >
              Hackathon Project Profile
            </span>
            <h1
              style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}
              className="text-slate-900 text-center"
            >
              About Signo AI
            </h1>
          </div>
          <p
            style={{ fontSize: 13, lineHeight: 1.75, maxWidth: 580 }}
            className="text-slate-500 font-medium mx-auto text-center"
          >
            An AI-powered platform that verifies contract authenticity, detects legal risks, and recommends whether a contract is safe to sign.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="w-full max-w-[1200px] mx-auto px-8 pb-24 flex flex-col items-center gap-20 self-center">

        {/* ── WHY CHOOSE ── */}
        <section className="w-full flex flex-col items-center gap-10">
          <div className="text-center flex flex-col items-center gap-1.5">
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }} className="text-slate-900 text-center">
              Why Choose Signo AI?
            </h2>
            <p style={{ fontSize: 12 }} className="text-slate-400 font-semibold text-center">
              Value-focused automated compliance analysis in seconds.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-[800px] mx-auto"
          >
            {[
              {
                icon: '🛡️',
                title: 'Contract Authenticity',
                description: 'Verifies whether a contract appears genuine using metadata, document integrity, and fraud detection.',
                benefit: '✅ Verifies contract authenticity',
              },
              {
                icon: '⚖️',
                title: 'Risk Analysis',
                description: 'Identifies high, medium, and low-risk legal clauses using machine learning.',
                benefit: '✅ Detects risky clauses automatically',
              },
              {
                icon: '💡',
                title: 'Plain English Explanations',
                description: 'Transforms complex legal language into simple explanations anyone can understand.',
                benefit: '✅ Explains legal terms in plain English',
              },
              {
                icon: '📄',
                title: 'AI Recommendation',
                description: 'Provides a final recommendation on whether the contract is safe to sign based on the complete analysis.',
                benefit: '✅ Gives a final recommendation before signing',
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                style={{
                  borderRadius: 20,
                  border: '1px solid #ECECEC',
                  boxShadow: CARD_SHADOW,
                  padding: 22,
                  transition: 'transform 300ms ease, box-shadow 300ms ease',
                }}
                className="bg-white flex flex-col items-center justify-between gap-4 text-center min-h-[190px] hover:-translate-y-1"
                onMouseEnter={e => { e.currentTarget.style.boxShadow = CARD_HOVER_SHADOW; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = CARD_SHADOW; }}
              >
                <div className="flex flex-col items-center gap-2.5">
                  <span style={{ fontSize: 22 }} className="select-none">{card.icon}</span>
                  <h3 style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em' }} className="text-slate-800 text-center">
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 12, lineHeight: 1.65 }} className="text-slate-500 font-medium text-center">
                    {card.description}
                  </p>
                </div>
                <div
                  style={{ fontSize: 11, paddingTop: 10, borderTop: '1px solid #F1F5F9', width: '100%' }}
                  className="font-extrabold text-[#5B5FFF] text-center"
                >
                  {card.benefit}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="w-full flex flex-col items-center gap-10">
          <div className="text-center flex flex-col items-center gap-1.5">
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }} className="text-slate-900 text-center">
              How It Works
            </h2>
            <p style={{ fontSize: 12 }} className="text-slate-400 font-semibold text-center">
              Our end-to-end processing pipeline in 5 simple stages.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-3 w-full max-w-[980px] mx-auto">
            {[
              { step: '①', title: 'Upload Contract', desc: 'PDF / DOCX' },
              { step: '②', title: 'Extract Text', desc: 'Raw parse' },
              { step: '③', title: 'Analyze Clauses', desc: 'Scan categories' },
              { step: '④', title: 'Detect Risks', desc: 'Weight scores' },
              { step: '⑤', title: 'Generate Verdict', desc: 'Final verdict' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
                <div
                  style={{
                    width: 160,
                    height: 128,
                    borderRadius: 20,
                    border: '1px solid #ECECEC',
                    boxShadow: CARD_SHADOW,
                    transition: 'transform 300ms ease, box-shadow 300ms ease',
                    flexShrink: 0,
                    padding: '16px 12px',
                  }}
                  className="bg-white flex flex-col justify-between items-center text-center w-full lg:w-[160px] hover:-translate-y-1 cursor-default"
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = CARD_HOVER_SHADOW; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = CARD_SHADOW; }}
                >
                  <span style={{ fontSize: 18 }} className="font-extrabold text-[#5B5FFF] select-none">{step.step}</span>
                  <div className="flex flex-col gap-0.5 items-center">
                    <h4 style={{ fontSize: 11, fontWeight: 800 }} className="text-slate-800 text-center">{step.title}</h4>
                    <p style={{ fontSize: 10, fontWeight: 600 }} className="text-slate-400 text-center">{step.desc}</p>
                  </div>
                </div>
                {idx < 4 && (
                  <FiArrowRight className="text-slate-300 rotate-90 lg:rotate-0 flex-shrink-0" size={14} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── KEY FEATURES ── */}
        <section className="w-full flex flex-col items-center gap-10">
          <div className="text-center flex flex-col items-center gap-1.5">
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }} className="text-slate-900 text-center">
              Key Features
            </h2>
            <p style={{ fontSize: 12 }} className="text-slate-400 font-semibold text-center">
              Included compliance capabilities.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center items-center w-full max-w-[680px] mx-auto">
            {[
              'PDF & DOCX Support',
              'TrustGuard Authenticity Checks',
              'AI Clause Explanations',
              'Legal Risk Detection',
              'Company Verification',
              'Downloadable PDF Report',
            ].map((feature, idx) => (
              <span
                key={idx}
                style={{
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 999,
                  border: '1px solid #E2E8F0',
                  fontSize: 11,
                  fontWeight: 700,
                  background: '#F8FAFC',
                  transition: 'background 200ms ease',
                  cursor: 'default',
                  whiteSpace: 'nowrap',
                }}
                className="text-slate-700 hover:bg-[#F1F5F9]"
              >
                {feature}
              </span>
            ))}
          </div>
        </section>

        {/* ── PROJECT INFORMATION ── */}
        <section className="w-full flex flex-col items-center gap-10">
          <div className="text-center flex flex-col items-center gap-1.5">
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }} className="text-slate-900 text-center">
              Project Information
            </h2>
            <p style={{ fontSize: 12 }} className="text-slate-400 font-semibold text-center">
              Hackathon submission metadata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-[800px] mx-auto">
            {[
              { label: 'Project', value: 'Signo AI', icon: '🚀' },
              { label: 'Team', value: 'UNITED CODERS', icon: '👥' },
              { label: 'Institution', value: "St. Joseph's Institute of Technology", icon: '🏫' },
            ].map((info, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 20,
                  border: '1px solid #ECECEC',
                  boxShadow: CARD_SHADOW,
                  height: 160,
                  padding: 22,
                  transition: 'transform 300ms ease, box-shadow 300ms ease',
                }}
                className="bg-white flex flex-col justify-center items-center text-center gap-2.5 hover:-translate-y-1 cursor-default"
                onMouseEnter={e => { e.currentTarget.style.boxShadow = CARD_HOVER_SHADOW; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = CARD_SHADOW; }}
              >
                <span style={{ fontSize: 24 }} className="select-none">{info.icon}</span>
                <div className="flex flex-col gap-0.5 items-center">
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em' }} className="text-slate-400 uppercase text-center">
                    {info.label}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, maxWidth: 160 }} className="text-slate-800 text-center mx-auto">
                    {info.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
