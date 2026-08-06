/**
 * Modal.jsx — Design System v2
 *
 * Accessible dialog with Framer Motion animations.
 * Composable sub-components: Modal.Header, Modal.Body, Modal.Footer.
 *
 * Props:
 *  open     : boolean
 *  onClose  : () => void
 *  size     : 'sm' | 'md' | 'lg' | 'xl'
 *  children : ReactNode
 *  title    : string (for aria-labelledby)
 */

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const widths = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

const dialogVariants = {
  hidden:  { opacity: 0, scale: 0.97, y: 8 },
  visible: { opacity: 1, scale: 1,    y: 0 },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function ModalHeader({ title, onClose }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
      <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] leading-none">
        {title}
      </h2>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="flex items-center justify-center w-7 h-7
                     rounded-[var(--radius-md)] text-[var(--color-text-tertiary)]
                     hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]
                     transition-colors focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          style={{ transitionDuration: '100ms' }}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function ModalBody({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}

function ModalFooter({ children, className = '' }) {
  return (
    <div
      className={[
        'flex items-center justify-end gap-2',
        'px-5 py-4 border-t border-[var(--color-border)]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
function Modal({ open, onClose, size = 'md', title, children }) {
  // Escape key to close
  const handleKey = useCallback(
    (e) => { if (e.key === 'Escape' && open) onClose?.(); },
    [open, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        // Backdrop
        <motion.div
          key="backdrop"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4
                     bg-black/40 backdrop-blur-[2px]"
          onClick={(e) => e.target === e.currentTarget && onClose?.()}
          aria-hidden="true"
        >
          {/* Dialog */}
          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dialogVariants}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={[
              'relative w-full',
              'rounded-[var(--radius-xl)] border border-[var(--color-border)]',
              'bg-[var(--color-bg-page)] shadow-[var(--shadow-xl)]',
              'overflow-hidden',
              widths[size] ?? widths.md,
            ].join(' ')}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

Modal.Header = ModalHeader;
Modal.Body   = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
