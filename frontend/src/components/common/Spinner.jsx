import { motion } from 'framer-motion';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-3.5 h-3.5 border-2',
    md: 'w-4 h-4 border-2',
    lg: 'w-6 h-6 border-2',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
      className={[
        'rounded-full border-t-transparent border-current shrink-0 inline-block',
        sizes[size] || sizes.md,
        className,
      ].join(' ')}
      aria-label="Loading"
      role="status"
    />
  );
}
