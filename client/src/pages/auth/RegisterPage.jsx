/**
 * RegisterPage.jsx — Account Registration Page
 *
 * Requirements:
 *  - Premium SaaS UI (Linear/Vercel style)
 *  - Split Layout
 *  - React Hook Form + Zod schema validation
 *  - Password strength helper indicators
 *  - Terms & conditions checkbox validation
 *  - Axios integration & JWT handling
 *  - Loading states (submit button spinner, disabled inputs)
 *  - Error states (inline field errors + top API error Alert banner)
 *  - Password visibility toggle with accessible state
 *  - Toast notifications via react-hot-toast
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Check } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { register as registerApi } from '../../services/auth.service';
import { getErrorMessage } from '../../utils';

import AuthSplitLayout from '../../components/layout/AuthSplitLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import PageTitle from '../../components/common/PageTitle';

// ── Zod Validation Schema ──────────────────────────────────────────────────
const registerSchema = z.object({
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
  terms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the Terms of Service & Privacy Policy',
    }),
});

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
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
      terms: true,
    },
  });

  const watchPassword = watch('password', '');

  // Password strength criteria calculation
  const passwordCriteria = [
    { label: 'At least 6 characters', met: watchPassword.length >= 6 },
    { label: 'Contains a number or symbol', met: /[0-[9]!@#$%^&*()]/.test(watchPassword) },
  ];

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const res = await registerApi({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      // API returns response wrapper: { success: true, data: { user, token } }
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
    <>
      <PageTitle title="Create an account" className="sr-only" />
      <AuthSplitLayout
        title="Create your account"
        subtitle="Get started with Snip.ly today. Shorten URLs, build branded links, and track performance."
      >
        <div className="space-y-5">
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Full Name Field */}
            <Input
              id="register-name"
              label="Full name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              leftIcon={<User className="w-4 h-4 text-[var(--color-text-tertiary)]" />}
              error={errors.name?.message}
              disabled={isSubmitting}
              required
              {...register('name')}
            />

            {/* Email Field */}
            <Input
              id="register-email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              leftIcon={<Mail className="w-4 h-4 text-[var(--color-text-tertiary)]" />}
              error={errors.email?.message}
              disabled={isSubmitting}
              required
              {...register('email')}
            />

            {/* Password Field */}
            <Input
              id="register-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-[var(--color-text-tertiary)]" />}
              error={errors.password?.message}
              disabled={isSubmitting}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="p-1 rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-colors"
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
              {...register('password')}
            />

            {/* Password strength indicators */}
            {watchPassword.length > 0 && (
              <div className="p-2.5 rounded-lg bg-[var(--color-bg-subtle)] border border-[var(--color-border)]/60 space-y-1.5 text-[11px]">
                <p className="font-medium text-[var(--color-text-secondary)] mb-1">Password requirements:</p>
                {passwordCriteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                        c.met
                          ? 'bg-[var(--color-success-subtle)] text-[var(--color-success)] border border-[var(--color-success-border)]'
                          : 'bg-[var(--color-bg-ui)] text-[var(--color-text-tertiary)]'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className={c.met ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Terms & Conditions Checkbox */}
            <div className="flex flex-col gap-1 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-[13px] text-[var(--color-text-secondary)] select-none">
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  className="mt-0.5 rounded border-[var(--color-border-input)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
                  {...register('terms')}
                />
                <span>
                  I agree to the{' '}
                  <a href="/#terms" className="text-[var(--color-accent)] hover:underline font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/#privacy" className="text-[var(--color-accent)] hover:underline font-medium">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms?.message && (
                <p role="alert" className="text-[12px] text-[var(--color-danger)] font-medium">
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-semibold shadow-sm"
              isLoading={isSubmitting}
              rightIcon={!isSubmitting && <UserPlus className="w-4 h-4" />}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Switch to Login page */}
          <p className="text-center text-[13px] text-[var(--color-text-secondary)]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded px-0.5"
            >
              Log in
            </Link>
          </p>
        </div>
      </AuthSplitLayout>
    </>
  );
}
