'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ComparisonHeader } from './ComparisonHeader';
import { ComparisonFilters } from './ComparisonFilters';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonStatistics } from './ComparisonStatistics';
import { ComparisonStats } from './ComparisonStats';
import { ComparisonMatrix } from '@/types/comparison';
import { SupportLevel } from '@/types';
import type { Agent, Feature, AgentFeatureSupport } from '@/types';

interface ComparisonContentProps {
  initialData: ComparisonMatrix;
}

export function ComparisonContent({ initialData }: ComparisonContentProps) {
  const [data] = useState<ComparisonMatrix>(initialData);
  const searchParams = useSearchParams();
  
  // Initialize filter states from URL query parameters
  const getInitialAgents = (): string[] => {
    const agentsParam = searchParams.get('agents');
    return agentsParam ? agentsParam.split(',').filter(Boolean) : [];
  };
  
  const getInitialFeatures = (): string[] => {
    const featuresParam = searchParams.get('features');
    return featuresParam ? featuresParam.split(',').filter(Boolean) : [];
  };
  
  // Filter states
  const [selectedAgents, setSelectedAgents] = useState<string[]>(getInitialAgents);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(getInitialFeatures);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSupportLevels, setSelectedSupportLevels] = useState<SupportLevel[]>([]);
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('expanded');
  const [showNotes, setShowNotes] = useState(true);

  // Filter the data based on selected filters
  const filteredAgents = selectedAgents.length > 0 
    ? data.agents.filter(agent => selectedAgents.includes(agent.id))
    : data.agents;

  const filteredFeatures = data.features.filter(feature => {
    // Filter by selected features
    if (selectedFeatures.length > 0 && !selectedFeatures.includes(feature.id)) {
      return false;
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0 && !selectedCategories.includes(feature.category)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ComparisonHeader statistics={data.statistics} />
        
        <ComparisonFilters
          agents={data.agents}
          features={data.features}
          selectedAgents={selectedAgents}
          setSelectedAgents={setSelectedAgents}
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedSupportLevels={selectedSupportLevels}
          setSelectedSupportLevels={setSelectedSupportLevels}
          searchQuery=""
          setSearchQuery={() => {}}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showNotes={showNotes}
          setShowNotes={setShowNotes}
        />
        
        <ComparisonTable
          agents={filteredAgents}
          features={filteredFeatures}
          matrix={data.matrix}
          viewMode={viewMode}
          showNotes={viewMode === 'expanded'}
          selectedSupportLevels={selectedSupportLevels}
        />
        
        <ComparisonStatistics
          data={data}
          filteredAgents={filteredAgents}
          filteredFeatures={filteredFeatures}
        />
      </div>
    </div>
  );
}

// New client component for /compare page
interface ComparePageClientProps {
  agents: Agent[]
  features: Feature[]
  supportMatrix: AgentFeatureSupport[]
  statistics: {
    totalAgents: number
    totalFeatures: number
    totalComparisons: number
    lastUpdated: string
  }
}

export function ComparePageClient({ agents, features, supportMatrix, statistics }: ComparePageClientProps) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSupportLevels, setSelectedSupportLevels] = useState<SupportLevel[]>(['yes', 'partial', 'no', 'unknown']);
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('expanded');
  const [showNotes, setShowNotes] = useState(true);

  return (
    <div className="min-h-screen text-white">
      {/* Header Section */}
      <ComparisonHeader statistics={statistics} />
      
      {/* Filters Section */}
      <ComparisonFilters 
        agents={agents} 
        features={features}
        selectedAgents={selectedAgents}
        setSelectedAgents={setSelectedAgents}
        selectedFeatures={selectedFeatures}
        setSelectedFeatures={setSelectedFeatures}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedSupportLevels={selectedSupportLevels}
        setSelectedSupportLevels={setSelectedSupportLevels}
        searchQuery=""
        setSearchQuery={() => {}}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
      />
      
      {/* Main Comparison Table */}
      <div className="mb-12">
        <ComparisonTable 
          agents={agents}
          features={features}
          supportMatrix={supportMatrix}
          matrix={{}}
          viewMode={viewMode}
          showNotes={showNotes}
          selectedSupportLevels={selectedSupportLevels}
        />
      </div>
      
      {/* Statistics Section */}
      <ComparisonStats 
        agents={agents}
        features={features}
        supportMatrix={supportMatrix}
      />
    </div>
  );
} 