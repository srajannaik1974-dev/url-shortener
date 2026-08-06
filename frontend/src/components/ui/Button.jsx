import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Spinner from '../common/Spinner';

const variants = {
  primary: 'emerald-glow-btn text-[#080C14] font-extrabold border border-[#34D399]/30',
  secondary: 'bg-[#1E293B] hover:bg-[#334155] active:bg-[#475569] text-[#F8FAFC] border border-[#334155]',
  outline: 'bg-transparent hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B] hover:border-[#334155]',
  ghost: 'bg-transparent hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]',
  danger: 'bg-[#F43F5E] hover:bg-[#E11D48] text-[#F8FAFC] shadow-sm',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg font-medium',
  md: 'h-9.5 px-4 text-xs gap-2 rounded-lg font-semibold',
  lg: 'h-11 px-5 text-sm gap-2 rounded-lg font-bold',
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.015 }}
      whileTap={isDisabled ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={[
        'inline-flex items-center justify-center select-none whitespace-nowrap transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C14]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className,
      ].join(' ')}
      {...rest}
    >
      {isLoading ? (
        <Spinner size={size === 'lg' ? 'md' : 'sm'} />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}

      <span>{children}</span>

      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
});

export default Button;
