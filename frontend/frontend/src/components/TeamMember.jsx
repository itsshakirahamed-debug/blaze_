import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

export default function TeamMember({
  name,
  role,
  avatar = '💻',
  bio = 'Building beautiful and responsive user interfaces for modern compliance and legal workflows.',
  github = 'https://github.com',
  linkedin = 'https://linkedin.com'
}) {
  return (
    <div className="flex justify-center w-full">
      <motion.div
        whileHover={{ y: -4 }}
        className="w-full max-w-[420px] bg-white border border-slate-200/60 p-8 rounded-[16px] shadow-sm shadow-indigo-100/10 hover:shadow-md hover:shadow-indigo-100/20 hover:border-[#5B5FFF]/40 transition-all text-center space-y-5"
      >
        {/* Profile Avatar Frame */}
        <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-3xl">
          {avatar}
        </div>

        {/* Profile Name & Role */}
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">{name}</h4>
          <p className="text-xs font-bold text-[#5B5FFF]">{role}</p>
        </div>

        {/* Short Biography */}
        <p className="text-slate-500 text-xs leading-relaxed max-w-[280px] mx-auto">
          {bio}
        </p>

        {/* Social Icons Links */}
        <div className="flex justify-center items-center gap-3 pt-2">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-xl border border-slate-150 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <FiGithub size={14} />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-xl border border-slate-150 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <FiLinkedin size={14} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
