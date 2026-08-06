import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, UserPlus, Check, X } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { register as registerApi } from '../../services/auth.service';
import { getErrorMessage } from '../../utils';

import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

// Zod Validation Schema with confirmPassword and terms check
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms of Service & Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: true,
    },
  });

  const watchPassword = watch('password', '');
  const watchConfirmPassword = watch('confirmPassword', '');

  // Password strength calculation
  const hasMinLength = watchPassword.length >= 6;
  const hasSymbolOrNum = /[0-9!@#$%^&*()]/.test(watchPassword);
  const passwordsMatch = watchPassword.length > 0 && watchPassword === watchConfirmPassword;

  // Strength score out of 3
  const strengthScore = [hasMinLength, hasSymbolOrNum, passwordsMatch].filter(Boolean).length;
  const strengthColors = ['bg-[#1E293B]', 'bg-[#F43F5E]', 'bg-[#F59E0B]', 'bg-[#10B981]'];

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const res = await registerApi({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      const payload = res.data?.data ?? res.data;

      if (!payload?.token) {
        throw new Error('No authentication token received from server');
      }

      login({ token: payload.token, user: payload.user });
      toast.success('Account created successfully! Welcome to Snip.ly');

      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err) || 'Failed to create account. Please try again.';
      setApiError(msg);
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Start shortening URLs, setting up custom aliases, and tracking click analytics."
    >
      <div className="space-y-4">
        {/* Top-level API Error Alert */}
        {apiError && (
          <Alert
            variant="danger"
            title="Registration Error"
            onClose={() => setApiError(null)}
          >
            {apiError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          {/* Full Name */}
          <Input
            id="name"
            label="Full name"
            type="text"
            autoComplete="name"
            autoFocus
            placeholder="Jane Doe"
            leftIcon={<User className="w-4 h-4 text-[#94A3B8]" />}
            error={errors.name?.message}
            disabled={isSubmitting}
            required
            {...register('name')}
          />

          {/* Email Address */}
          <Input
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            leftIcon={<Mail className="w-4 h-4 text-[#94A3B8]" />}
            error={errors.email?.message}
            disabled={isSubmitting}
            required
            {...register('email')}
          />

          {/* Password */}
          <PasswordInput
            id="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            disabled={isSubmitting}
            required
            {...register('password')}
          />

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            disabled={isSubmitting}
            required
            {...register('confirmPassword')}
          />

          {/* Password Strength Meter & Requirements */}
          {watchPassword.length > 0 && (
            <div className="p-3 rounded-lg bg-[#080C14]/90 border border-[#1E293B] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#94A3B8]">Password strength:</span>
                <span className="font-mono text-[10px] uppercase font-semibold text-[#F8FAFC]">
                  {strengthScore === 3 ? 'Strong' : strengthScore === 2 ? 'Medium' : 'Weak'}
                </span>
              </div>

              {/* Progress bars */}
              <div className="grid grid-cols-3 gap-1.5 h-1">
                <div className={`h-full rounded-full transition-colors duration-200 ${strengthScore >= 1 ? strengthColors[strengthScore] : 'bg-[#1E293B]'}`} />
                <div className={`h-full rounded-full transition-colors duration-200 ${strengthScore >= 2 ? strengthColors[strengthScore] : 'bg-[#1E293B]'}`} />
                <div className={`h-full rounded-full transition-colors duration-200 ${strengthScore >= 3 ? strengthColors[strengthScore] : 'bg-[#1E293B]'}`} />
              </div>

              {/* Checklist */}
              <div className="space-y-1 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {hasMinLength ? (
                    <Check className="w-3 h-3 text-[#10B981]" />
                  ) : (
                    <X className="w-3 h-3 text-[#64748B]" />
                  )}
                  <span className={hasMinLength ? 'text-[#F8FAFC]' : 'text-[#64748B]'}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasSymbolOrNum ? (
                    <Check className="w-3 h-3 text-[#10B981]" />
                  ) : (
                    <X className="w-3 h-3 text-[#64748B]" />
                  )}
                  <span className={hasSymbolOrNum ? 'text-[#F8FAFC]' : 'text-[#64748B]'}>
                    Contains number or symbol
                  </span>
                </div>
                {watchConfirmPassword.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {passwordsMatch ? (
                      <Check className="w-3 h-3 text-[#10B981]" />
                    ) : (
                      <X className="w-3 h-3 text-[#F43F5E]" />
                    )}
                    <span className={passwordsMatch ? 'text-[#F8FAFC]' : 'text-[#F43F5E]'}>
                      Passwords match
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="flex flex-col gap-1 pt-1">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-[#94A3B8] select-none">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="mt-0.5 w-3.5 h-3.5 rounded border-[#1E293B] bg-[#080C14] text-[#10B981] focus:ring-[#10B981] cursor-pointer"
                {...register('terms')}
              />
              <span>
                I agree to the{' '}
                <a href="#terms" className="text-[#10B981] hover:underline font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-[#10B981] hover:underline font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms?.message && (
              <p role="alert" className="text-[11px] text-[#F43F5E] font-medium">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={!isSubmitting && <UserPlus className="w-4 h-4" />}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        {/* Login Navigation Link */}
        <p className="text-center text-xs text-[#94A3B8]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#10B981] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#10B981] rounded px-0.5"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
