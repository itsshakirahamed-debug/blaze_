import { FaFire } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{
      background: '#fff',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      width: '100%',
      padding: '48px 32px',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        textAlign: 'center',
      }}>

        {/* Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, #f97316, #f43f5e)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
          }}>
            <FaFire style={{ color: '#fff', fontSize: 13 }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em', color: '#0f172a' }}>
            Signo <span style={{ color: '#5B5FFF' }}>AI</span>
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 40, height: 1, background: '#e2e8f0', borderRadius: 999 }} />

        {/* Team */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>
            Built by <span style={{ color: '#5B5FFF' }}>UNITED CODERS</span>
          </p>
          <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
            St. Joseph's Institute of Technology
          </p>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
          © 2026 Signo AI • All rights reserved
        </p>

      </div>
    </footer>
  );
}
