import PageTitle from '../../components/common/PageTitle';

export default function LandingPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)]
                        px-4 text-center">
      <PageTitle title="Welcome to Snip.ly" />
      <p className="text-[var(--text-secondary)] max-w-md">
        The fast, analytics-rich URL shortener. Landing page coming soon.
      </p>
    </section>
  );
}
