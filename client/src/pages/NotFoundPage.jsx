import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTitle from '../components/common/PageTitle';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-dvh px-4 text-center
                        bg-[var(--bg-base)]">
      <p className="text-8xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
        404
      </p>
      <PageTitle
        title="Page not found"
        subtitle="The page you're looking for doesn't exist or has been moved."
        className="mb-6"
      />
      <Link to="/">
        <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
          Go back home
        </Button>
      </Link>
    </section>
  );
}
