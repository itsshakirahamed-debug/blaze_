import { motion } from 'framer-motion';
import {
  FiShield, FiZap, FiBarChart2, FiDownload, FiLock, FiTrendingUp,
  FiUploadCloud, FiCpu, FiArrowRight,
} from 'react-icons/fi';
import { FaReact } from 'react-icons/fa';
import { SiFastapi, SiGoogle, SiTailwindcss, SiScikitlearn } from 'react-icons/si';
import { Link } from 'react-router-dom';
import HeroSection from '@components/HeroSection';
import FeatureCard from '@components/FeatureCard';

const SECTION_CONTAINER = 'w-full max-w-[1280px] mx-auto px-8';
const CARD_SHADOW = '0 8px 30px rgba(15,23,42,0.06)';
const CARD_HOVER_SHADOW = '0 16px 48px rgba(15,23,42,0.12)';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
};

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
    >
      {eyebrow && (
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5B5FFF', background: '#eef2ff', padding: '4px 12px', borderRadius: 999 }}>
          {eyebrow}
        </span>
      )}
      <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', lineHeight: 1.2 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, fontWeight: 500 }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default function Home() {
  const features = [
    { icon: FiShield, title: 'Risk Detection', description: 'Automatically identify and flag risky clauses using advanced AI models trained on legal documents.' },
    { icon: FiZap, title: 'Lightning Fast', description: 'Get comprehensive analysis results in seconds, not hours. Optimized for speed and accuracy.' },
    { icon: FiBarChart2, title: 'Visual Analytics', description: 'Beautiful charts and graphs showing risk distribution, clause types, and key metrics.' },
    { icon: FiDownload, title: 'Downloadable Reports', description: 'Export detailed PDF reports with recommendations and risk mitigation strategies.' },
    { icon: FiLock, title: 'Secure Processing', description: 'Your contracts are encrypted and never stored. Complete privacy and data security.' },
    { icon: FiTrendingUp, title: 'AI Explanations', description: 'Get simple language explanations of complex legal terms and risk factors.' },
  ];

  const techStack = [
    { name: 'React', icon: FaReact, color: '#0ea5e9' },
    { name: 'FastAPI', icon: SiFastapi, color: '#10b981' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#6366f1' },
    { name: 'Gemini AI', icon: SiGoogle, color: '#3b82f6' },
    { name: 'Scikit-learn', icon: SiScikitlearn, color: '#f97316' },
    { name: 'PyMuPDF', icon: FiDownload, color: '#8b5cf6' },
    { name: 'Framer Motion', icon: FiZap, color: '#ec4899' },
    { name: 'ReportLab', icon: FiBarChart2, color: '#14b8a6' },
  ];

  const workflowSteps = [
    { step: '01', icon: FiUploadCloud, title: 'Upload Contract', desc: 'Drag and drop any PDF or DOCX agreement into the platform.' },
    { step: '02', icon: FiCpu, title: 'Extract & Analyze', desc: 'NLP models isolate clauses, entities, and structure automatically.' },
    { step: '03', icon: FiShield, title: 'Risk Verification', desc: 'Multi-layer TrustGuard scoring grades every legal parameter.' },
    { step: '04', icon: FiDownload, title: 'Generate Report', desc: 'Download a comprehensive PDF audit with AI recommendations.' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFF] w-full flex flex-col items-center">

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── CORE CAPABILITIES ── */}
      <section id="features" className="w-full flex justify-center py-24 bg-white border-y border-slate-100/80">
        <div className={SECTION_CONTAINER}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 56 }}>

            <SectionHeader
              eyebrow="Platform Features"
              title="Core Capabilities"
              subtitle="Everything you need for comprehensive contract verification and analysis."
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, width: '100%' }}
            >
              {features.map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants} style={{ height: '100%' }}>
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="w-full flex justify-center py-24 bg-[#FAFBFF] border-b border-slate-100/80">
        <div className={SECTION_CONTAINER}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 56 }}>

            <SectionHeader
              eyebrow="Process Timeline"
              title="How It Works"
              subtitle="Simple, transparent, and secure — from upload to verified audit report in four steps."
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 1000, margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, width: '100%', position: 'relative' }}>

                {/* Connector line (desktop) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 44,
                    left: '12.5%',
                    right: '12.5%',
                    height: 1,
                    background: 'linear-gradient(to right, #e0e7ff, #c7d2fe, #e0e7ff)',
                    zIndex: 0,
                  }}
                  className="hidden lg:block"
                />

                {workflowSteps.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0 16px',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {/* Step badge */}
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: '#5B5FFF', background: '#eef2ff', padding: '3px 10px', borderRadius: 999, marginBottom: 14 }}>
                        Step {item.step}
                      </span>

                      {/* Icon circle */}
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: '#fff',
                          border: '1.5px solid rgba(91,95,255,0.2)',
                          boxShadow: CARD_SHADOW,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20,
                        }}
                      >
                        <Icon size={20} style={{ color: '#5B5FFF' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>{item.title}</h4>
                        <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.65, fontWeight: 500, maxWidth: 180, margin: '0 auto' }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="w-full flex justify-center py-24 bg-white border-b border-slate-100/80">
        <div className={SECTION_CONTAINER}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 56 }}>

            <SectionHeader
              title="Built With Modern Technology"
              subtitle="Engineered with production-grade AI frameworks and developer tooling."
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, maxWidth: 720 }}
            >
              {techStack.map((tech, idx) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -2, boxShadow: CARD_HOVER_SHADOW }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 20px',
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.07)',
                      borderRadius: 999,
                      boxShadow: CARD_SHADOW,
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'default',
                      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon size={15} style={{ color: tech.color, flexShrink: 0 }} />
                    {tech.name}
                  </motion.div>
                );
              })}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="w-full flex justify-center py-24 bg-[#FAFBFF]">
        <div className={SECTION_CONTAINER}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'linear-gradient(135deg, #5B5FFF 0%, #3b82f6 100%)',
              borderRadius: 24,
              padding: '72px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(91,95,255,0.28)',
            }}
          >
            {/* Ambient glows */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, background: 'rgba(255,255,255,0.07)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -80, left: -40, width: 280, height: 280, background: 'rgba(30,27,75,0.15)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, maxWidth: 600, margin: '0 auto' }}>
              <h2 style={{ fontSize: 38, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Ready to Analyze Your Contract?
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(238,242,255,0.9)', lineHeight: 1.7, fontWeight: 500, maxWidth: 480 }}>
                Upload your contract and receive instant authenticity verification, legal risk analysis, AI explanations, and a downloadable audit report.
              </p>
              <Link
                to="/upload"
                style={{
                  marginTop: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fff',
                  color: '#1e293b',
                  fontWeight: 800,
                  fontSize: 14,
                  padding: '14px 32px',
                  borderRadius: 14,
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(15,23,42,0.18)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                className="hover:-translate-y-0.5 hover:shadow-xl"
              >
                Start Analyzing Now <FiArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
