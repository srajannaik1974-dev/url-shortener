import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { User, ChevronDown, Sparkles } from 'lucide-react';
import Logo from '../common/Logo';

/**
 * AuthLayout.jsx
 *
 * BL.INK-inspired high-converting SaaS layout featuring rich midnight navy aesthetics,
 * glowing emerald accents, top enterprise navigation header, and glassmorphic auth panel.
 */
export default function AuthLayout({ children, title, subtitle }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen w-full bg-[#080C14] text-[#F8FAFC] font-['Inter'] relative flex flex-col justify-between overflow-x-hidden">
      {/* ── Background Glow & Orbital Wireframes ──────────────────────────────── */}
      <div className="absolute inset-0 bg-blink-gradient pointer-events-none z-0" />
      
      {/* Geometric background arc line */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-25 pointer-events-none stroke-[#1E293B]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50%" cy="-100" r="550" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="50%" cy="-100" r="420" strokeWidth="1" />
      </svg>

      {/* ── Top Header Navigation Bar (BL.INK Inspired) ─────────────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Brand */}
        <Logo size="md" />

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#94A3B8]">
          <div className="flex items-center gap-1 hover:text-[#F8FAFC] cursor-pointer transition-colors">
            <span>Why Snip.ly?</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </div>
          <div className="flex items-center gap-1 hover:text-[#F8FAFC] cursor-pointer transition-colors">
            <span>Products</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </div>
          <div className="flex items-center gap-1 hover:text-[#F8FAFC] cursor-pointer transition-colors">
            <span>Solutions</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </div>
          <a href="#pricing" className="hover:text-[#F8FAFC] transition-colors">Pricing</a>
          <a href="#resources" className="hover:text-[#F8FAFC] transition-colors">Resources</a>
          <a href="#support" className="hover:text-[#F8FAFC] transition-colors">Support</a>
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to={isLoginPage ? '/register' : '/login'}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#F8FAFC] bg-[#0F172A]/80 hover:bg-[#1E293B] border border-[#1E293B] rounded-lg transition-all"
          >
            <User className="w-3.5 h-3.5 text-[#10B981]" />
            <span>{isLoginPage ? 'Create Account' : 'Login'}</span>
          </Link>

          <Link
            to="/register"
            className="emerald-glow-btn px-4 py-2 text-xs font-bold text-[#080C14] rounded-lg flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Get Started</span>
          </Link>
        </div>
      </header>

      {/* ── Main Hero Section & Auth Container ───────────────────────────────── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center my-auto">
        {/* Subtle Headline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-semibold text-[#34D399]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
          <span>Enterprise Link Management Platform</span>
        </motion.div>

        {/* Central Auth Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-[420px]"
        >
          <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-7 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Top Glowing Gradient Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#1E40AF]" />

            {/* Section Heading */}
            <div className="space-y-1.5 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form Content */}
            {children}
          </div>
        </motion.div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#1E293B]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="font-mono text-[#94A3B8]">Systems Operational &bull; 99.99% Uptime</span>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <a href="#privacy" className="hover:text-[#94A3B8] transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-[#94A3B8] transition-colors">Terms of Service</a>
          <a href="#security" className="hover:text-[#94A3B8] transition-colors">Security</a>
        </div>

        <p>&copy; {new Date().getFullYear()} Snip.ly Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
