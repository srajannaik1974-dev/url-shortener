import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../services/auth.service';
import { getErrorMessage } from '../../utils';

import AuthSplitLayout from '../../components/layout/AuthSplitLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageTitle from '../../components/common/PageTitle';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      const res = await loginApi(data);
      const payload = res.data?.data ?? res.data;
      login({ token: payload.token, user: payload.user });
      
      toast.success('Welcome back!');
      
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Invalid email or password');
    }
  };

  return (
    <>
      <PageTitle title="Log in" className="sr-only" />
      <AuthSplitLayout 
        title="Welcome back" 
        subtitle="Enter your credentials to access your account."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="w-full h-full flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] focus-visible:outline-none rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            {...register('password')}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={isSubmitting}
          >
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-[var(--color-text-secondary)]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-[var(--color-accent)] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </AuthSplitLayout>
    </>
  );
}
