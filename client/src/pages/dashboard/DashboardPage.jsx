import PageTitle from '../../components/common/PageTitle';

export default function DashboardPage() {
  return (
    <div>
      <PageTitle title="Dashboard" subtitle="Overview of your shortened URLs and analytics." />
      <p className="text-[var(--text-secondary)] text-sm">Dashboard widgets coming in Phase 2.</p>
    </div>
  );
}
