import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#09090B] text-[#FAFAFA] px-4">
      <div className="text-center space-y-4 max-w-md">
        <span className="text-4xl font-mono font-bold text-[#2563EB]">404</span>
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="text-xs text-[#A1A1AA]">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link to="/login">
            <Button variant="primary" size="md">
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
