/**
 * ConfirmDialog.jsx — Design System v2
 *
 * Specialized modal for destructive confirmations.
 * Uses Modal internally. Clear visual hierarchy: danger icon, title, description, actions.
 *
 * Props:
 *  open        : boolean
 *  onClose     : () => void
 *  onConfirm   : () => void | Promise<void>
 *  title       : string
 *  description : string
 *  confirmLabel: string (default 'Delete')
 *  cancelLabel : string (default 'Cancel')
 *  isLoading   : boolean
 *  variant     : 'danger' | 'warning'
 */

import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]',
    btnVariant: 'danger',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]',
    btnVariant: 'danger',
  },
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'danger',
}) {
  const cfg = variantConfig[variant] ?? variantConfig.danger;
  const Icon = cfg.icon;

  const handleConfirm = async () => {
    await onConfirm?.();
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} size="sm" title={title}>
      <Modal.Body className="flex flex-col items-start gap-3 pt-5">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] ${cfg.iconBg}`}
          aria-hidden="true"
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1">
            {title}
          </p>
          <p className="text-[13px] text-[var(--color-text-secondary)] leading-[20px]">
            {description}
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={cfg.btnVariant}
          size="sm"
          onClick={handleConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
