import { ComparisonMatrix } from '@/types/comparison';

interface ComparisonHeaderProps {
  statistics: ComparisonMatrix['statistics'];
}

export function ComparisonHeader({ statistics }: ComparisonHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-2">
            All AI Coding Agents Compared Side-by-Side
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl">
            Explore detailed support levels for every major AI coding agent across dozens of capabilities—from 
            context handling and model support to execution strategies and IDE compatibility.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-blue-400">{statistics.totalAgents}</span>
            <span className="text-gray-400">AI Agents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-green-400">{statistics.totalFeatures}</span>
            <span className="text-gray-400">Features</span>
          </div>
        </div>
      </div>
    </div>
  );
} 