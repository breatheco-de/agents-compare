import { Metadata } from 'next';
import { Suspense } from 'react';
import { ComparisonContent } from '@/components/comparison/ComparisonContent';
import { loadComparisonMatrix } from '@/lib/comparison-loader';

export const metadata: Metadata = {
  title: 'Complete AI Coding Agents Comparison - Feature Matrix & Capabilities',
  description: 'Compare all AI coding agents side-by-side. Complete feature matrix showing support levels, capabilities, and compatibility across every major coding assistant.',
  openGraph: {
    title: 'Complete AI Coding Agents Comparison - Feature Matrix & Capabilities',
    description: 'Compare all AI coding agents side-by-side. Complete feature matrix showing support levels, capabilities, and compatibility across every major coding assistant.',
    type: 'website',
    url: '/compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complete AI Coding Agents Comparison',
    description: 'Compare all AI coding agents side-by-side with our complete feature matrix.',
  },
  alternates: {
    canonical: '/compare',
  },
};

export default async function ComparePage() {
  const data = await loadComparisonMatrix();
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="text-white">Loading comparison...</div></div>}>
      <ComparisonContent initialData={data} />
    </Suspense>
  );
} 