import { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from './Input';

const PasswordInput = forwardRef(function PasswordInput(
  {
    id = 'password',
    label = 'Password',
    placeholder = '••••••••',
    error,
    disabled,
    autoComplete = 'current-password',
    showLockIcon = true,
    ...rest
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      id={id}
      label={label}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      autoComplete={autoComplete}
      error={error}
      disabled={disabled}
      leftIcon={showLockIcon ? <Lock className="w-4 h-4 text-[#A1A1AA]" /> : null}
      rightElement={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="p-1 rounded text-[#A1A1AA] hover:text-[#FAFAFA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563EB] transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      }
      {...rest}
    />
  );
});

export default PasswordInput;
