import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyze', path: '/upload' },
    { name: 'About', path: '/about' },
  ];

  const activeSpring = { type: 'spring', stiffness: 380, damping: 30 };

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: 'rgba(250,251,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(148,163,184,0.18)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 20px rgba(15,23,42,0.06)' : 'none',
      }}
    >
      <div className="relative mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* LEFT — Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group flex-shrink-0 z-10 ml-2 sm:ml-4 lg:ml-6"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-sm shadow-orange-100">
            <FaFire className="text-white text-base animate-pulse" />
          </div>
          <span className="text-[14px] font-extrabold tracking-tight text-slate-900">
            Signo <span className="text-[#5B5FFF]">AI</span>
          </span>
        </Link>

        {/* CENTER — Nav Links (absolute, true viewport-center) */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[13px] font-semibold tracking-wide transition-colors relative py-1.5 px-1 ${isActive ? 'text-[#5B5FFF]' : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5B5FFF] rounded-full"
                    transition={activeSpring}
                  />
                )}
              </Link>
            );
          })}
        </nav>


        {/* MOBILE — Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-slate-500 hover:text-slate-800 transition-colors p-2 ml-auto"
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* MOBILE — Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="md:hidden w-full border-t border-slate-100 bg-white/95 backdrop-blur-md px-6 py-4 flex flex-col gap-2"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-[#5B5FFF]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/upload"
              onClick={() => setIsOpen(false)}
              className="mt-2 block w-full text-center bg-[#5B5FFF] hover:bg-[#4a4deb] text-white py-2.5 rounded-[10px] text-[13px] font-bold transition-colors"
            >
              Analyze Contract
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
