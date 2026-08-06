/**
 * PageTransition.jsx — Design System v2
 *
 * Wraps page content in a Framer Motion fade-up animation.
 * Used in layouts to wrap <Outlet />.
 *
 * Props:
 *  children : ReactNode
 *  className: string
 */

import { motion } from 'framer-motion';

const variants = {
  hidden:  { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
