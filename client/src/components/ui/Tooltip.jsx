/**
 * Tooltip.jsx — Design System v2
 *
 * Accessible tooltip with Framer Motion fade animation.
 * Keyboard-navigable: shows on focus, hides on blur.
 *
 * Props:
 *  content   : string | ReactNode — tooltip text
 *  side      : 'top' | 'bottom' | 'left' | 'right' (default 'top')
 *  delayMs   : number (default 500)
 *  className : string — applied to trigger wrapper
 *  children  : ReactNode — the trigger element
 */

import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const sideClasses = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full  left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full  top-1/2 -translate-y-1/2 ml-2',
};

const tooltipVariants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

let uid = 0;
function useId() {
  const ref = useRef(null);
  if (ref.current === null) ref.current = `tooltip-${++uid}`;
  return ref.current;
}

export default function Tooltip({
  content,
  side = 'top',
  delayMs = 500,
  className = '',
  children,
}) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const id = useId();

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delayMs);
  }, [delayMs]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  if (!content) return children;

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {/* Trigger — inject aria-describedby */}
      {typeof children === 'object'
        ? { ...children, props: { ...children.props, 'aria-describedby': id } }
        : children}

      <AnimatePresence>
        {visible && (
          <motion.span
            id={id}
            role="tooltip"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={tooltipVariants}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className={[
              'absolute z-[var(--z-dropdown)] pointer-events-none',
              'px-2 py-1 rounded-[var(--radius-sm)]',
              'bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]',
              'text-[11px] font-medium leading-none whitespace-nowrap',
              'shadow-[var(--shadow-md)]',
              sideClasses[side] ?? sideClasses.top,
            ].join(' ')}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
