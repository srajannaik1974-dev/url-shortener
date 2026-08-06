import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    id,
    label,
    helperText,
    error,
    leftIcon,
    rightElement,
    className = '',
    required,
    autoFocus,
    type = 'text',
    ...rest
  },
  ref
) {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-[#F8FAFC] flex items-center justify-between select-none"
        >
          <span>
            {label}
            {required && <span className="ml-1 text-[#F43F5E]">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center justify-center text-[#94A3B8] pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={type}
          autoFocus={autoFocus}
          aria-describedby={helperText || error ? `${id}-hint` : undefined}
          aria-invalid={hasError || undefined}
          required={required}
          className={[
            'w-full h-10 px-3.5 text-xs bg-[#080C14]/90 text-[#F8FAFC] placeholder-[#64748B]',
            'border rounded-lg transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-1 focus:ring-offset-[#080C14]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            hasError
              ? 'border-[#F43F5E] focus:ring-[#F43F5E]'
              : 'border-[#1E293B] hover:border-[#334155] focus:border-[#10B981]',
            leftIcon ? 'pl-10' : '',
            rightElement ? 'pr-10' : '',
          ].join(' ')}
          {...rest}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center justify-center text-[#94A3B8]">
            {rightElement}
          </div>
        )}
      </div>

      {(helperText || error) && (
        <p
          id={`${id}-hint`}
          role={hasError ? 'alert' : undefined}
          className={`text-[11px] leading-tight ${
            hasError ? 'text-[#F43F5E] font-medium' : 'text-[#94A3B8]'
          }`}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
