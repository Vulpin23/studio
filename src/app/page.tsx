import { AnalysisDashboard } from '@/components/app/analysis-dashboard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <AnalysisDashboard />
    </main>
  );
}
