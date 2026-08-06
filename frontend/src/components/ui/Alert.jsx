import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const alertVariants = {
  danger: {
    container: 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]',
    icon: AlertCircle,
  },
  warning: {
    container: 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]',
    icon: AlertTriangle,
  },
  success: {
    container: 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]',
    icon: CheckCircle2,
  },
  info: {
    container: 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#60A5FA]',
    icon: Info,
  },
};

export default function Alert({
  variant = 'danger',
  title,
  children,
  onClose,
  className = '',
}) {
  const config = alertVariants[variant] || alertVariants.danger;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={[
          'flex items-start gap-3 p-3.5 rounded-lg border text-xs leading-relaxed font-normal',
          config.container,
          className,
        ].join(' ')}
      >
        <Icon className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && <h5 className="font-semibold mb-0.5 tracking-tight">{title}</h5>}
          <div className="opacity-90">{children}</div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-0.5 rounded opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
