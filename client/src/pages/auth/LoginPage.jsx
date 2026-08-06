/**
 * LoginPage.jsx — Authentication Page
 *
 * Requirements:
 *  - Premium SaaS UI (Linear/Vercel style)
 *  - Split Layout
 *  - React Hook Form + Zod schema validation
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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, ArrowRight, KeyRound } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../services/auth.service';
import { getErrorMessage } from '../../utils';

import AuthSplitLayout from '../../components/layout/AuthSplitLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import PageTitle from '../../components/common/PageTitle';

// ── Zod Validation Schema ──────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const res = await loginApi({
        email: data.email.trim(),
        password: data.password,
      });

      // API returns response wrapper: { success: true, data: { user, token } }
      const payload = res.data?.data ?? res.data;
      
      if (!payload?.token) {
        throw new Error('No authentication token received from server');
      }

      login({ token: payload.token, user: payload.user });
      toast.success(`Welcome back${payload.user?.name ? `, ${payload.user.name}` : ''}!`);

      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err) || 'Invalid email or password';
      setApiError(msg);
      toast.error(msg);
    }
  };

  // Helper for demo quick fill
  const handleFillDemo = () => {
    setValue('email', 'admin@example.com', { shouldValidate: true });
    setValue('password', 'Admin123!', { shouldValidate: true });
    setApiError(null);
  };

  return (
    <>
      <PageTitle title="Log in" className="sr-only" />
      <AuthSplitLayout
        title="Welcome back"
        subtitle="Sign in to your Snip.ly account to manage your URLs and view real-time analytics."
      >
        <div className="space-y-5">
          {/* Top-level API Error Alert */}
          {apiError && (
            <Alert
              variant="danger"
              title="Authentication Failed"
              onClose={() => setApiError(null)}
            >
              {apiError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email Field */}
            <Input
              id="login-email"
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
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-semibold shadow-sm"
              isLoading={isSubmitting}
              rightIcon={!isSubmitting && <ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="pt-2 border-t border-[var(--color-border)]/50 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors py-1 px-2 rounded hover:bg-[var(--color-bg-subtle)]"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Fill demo credentials</span>
            </button>
          </div>

          {/* Switch to Register page */}
          <p className="text-center text-[13px] text-[var(--color-text-secondary)]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded px-0.5"
            >
              Create an account
            </Link>
          </p>
        </div>
      </AuthSplitLayout>
    </>
  );
}
