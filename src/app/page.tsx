import { AnalysisDashboard } from '@/components/app/analysis-dashboard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 md:p-8">
      <AnalysisDashboard />
    </main>
  );
}
