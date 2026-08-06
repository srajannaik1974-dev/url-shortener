import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, ArrowRight, KeyRound } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../services/auth.service';
import { getErrorMessage } from '../../utils';

import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

// Zod Validation Schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const res = await loginApi({
        email: data.email.trim(),
        password: data.password,
      });

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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.error('Password reset link feature requires email service setup in workspace settings.', {
      duration: 4000,
    });
  };

  const handleFillDemo = () => {
    setValue('email', 'admin@example.com', { shouldValidate: true });
    setValue('password', 'Admin123!', { shouldValidate: true });
    setApiError(null);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your Snip.ly account to shorten URLs, set custom aliases, and view analytics."
    >
      <div className="space-y-4">
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
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="name@company.com"
            leftIcon={<Mail className="w-4 h-4 text-[#94A3B8]" />}
            error={errors.email?.message}
            disabled={isSubmitting}
            required
            {...register('email')}
          />

          {/* Password Field */}
          <div>
            <PasswordInput
              id="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              disabled={isSubmitting}
              required
              {...register('password')}
            />

            <div className="flex items-center justify-between mt-2.5">
              {/* Remember Me Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#94A3B8] select-none hover:text-[#F8FAFC] transition-colors">
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  className="w-3.5 h-3.5 rounded border-[#1E293B] bg-[#080C14] text-[#10B981] focus:ring-[#10B981] cursor-pointer"
                  {...register('rememberMe')}
                />
                <span>Remember me</span>
              </label>

              {/* Forgot Password Link */}
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-[#94A3B8] hover:text-[#10B981] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#10B981] rounded px-1 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={!isSubmitting && <ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Demo Account Quick Fill */}
        <div className="pt-2 border-t border-[#1E293B] text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#94A3B8] hover:text-[#10B981] transition-colors py-1 px-2.5 rounded hover:bg-[#1E293B]/50"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Fill demo credentials</span>
          </button>
        </div>

        {/* Register Navigation Link */}
        <p className="text-center text-xs text-[#94A3B8]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#10B981] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#10B981] rounded px-0.5"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
