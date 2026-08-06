import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  ...rest
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={[
        'rounded-xl bg-[#111827] text-[#FAFAFA]',
        bordered ? 'border border-[#27272A]' : '',
        hoverable ? 'transition-colors hover:border-[#3F3F46]' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
