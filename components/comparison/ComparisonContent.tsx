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

interface ComparePageClientSelection {
  initialAgentIds?: string[]
  initialFeatureIds?: string[]
  ignoredAgentIds?: string[]
  ignoredFeatureIds?: string[]
}

// Splits a comma-separated query value into ids that exist and ids that don't.
function parseIdList(value: string | null, validIds: string[]) {
  const ids = Array.from(new Set((value || '').split(',').map(id => id.trim()).filter(Boolean)));
  return {
    valid: ids.filter(id => validIds.includes(id)),
    ignored: ids.filter(id => !validIds.includes(id))
  };
}

// Reads ?agents= and ?features= from the URL and preselects them.
// Must be rendered inside a <Suspense> boundary because it uses useSearchParams.
export function ComparePageFromUrl(props: ComparePageClientProps) {
  const searchParams = useSearchParams();
  const agentIds = parseIdList(searchParams.get('agents'), props.agents.map(a => a.id));
  const featureIds = parseIdList(searchParams.get('features'), props.features.map(f => f.id));

  return (
    <ComparePageClient
      // Remount when the query changes so the initial selection is re-applied
      key={searchParams.toString()}
      {...props}
      initialAgentIds={agentIds.valid}
      initialFeatureIds={featureIds.valid}
      ignoredAgentIds={agentIds.ignored}
      ignoredFeatureIds={featureIds.ignored}
    />
  );
}

export function ComparePageClient({
  agents,
  features,
  supportMatrix,
  statistics,
  initialAgentIds = [],
  initialFeatureIds = [],
  ignoredAgentIds = [],
  ignoredFeatureIds = []
}: ComparePageClientProps & ComparePageClientSelection) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>(initialAgentIds);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFeatureIds);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSupportLevels, setSelectedSupportLevels] = useState<SupportLevel[]>(['yes', 'partial', 'no', 'unknown']);
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('expanded');
  const [showNotes, setShowNotes] = useState(true);

  // An empty selection means "show everything"
  const filteredAgents = selectedAgents.length > 0
    ? agents.filter(agent => selectedAgents.includes(agent.id))
    : agents;

  const filteredFeatures = features.filter(feature =>
    (selectedFeatures.length === 0 || selectedFeatures.includes(feature.id)) &&
    (selectedCategories.length === 0 || selectedCategories.includes(feature.category))
  );

  const filteredSupportMatrix = supportMatrix.filter(s =>
    filteredAgents.some(a => a.id === s.agent_id) &&
    filteredFeatures.some(f => f.id === s.feature_id)
  );

  const ignoredIds = [...ignoredAgentIds, ...ignoredFeatureIds];

  return (
    <div className="min-h-screen text-white">
      {/* Header Section */}
      <ComparisonHeader statistics={statistics} />

      {ignoredIds.length > 0 && (
        <div role="alert" className="mb-6 rounded-lg border border-yellow-600/50 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-200">
          Ignored unknown {ignoredIds.length > 1 ? 'ids' : 'id'} in the URL: {ignoredIds.join(', ')}.
        </div>
      )}

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
          agents={filteredAgents}
          features={filteredFeatures}
          supportMatrix={filteredSupportMatrix}
          matrix={{}}
          viewMode={viewMode}
          showNotes={showNotes}
          selectedSupportLevels={selectedSupportLevels}
        />
      </div>

      {/* Statistics Section */}
      <ComparisonStats
        agents={filteredAgents}
        features={filteredFeatures}
        supportMatrix={filteredSupportMatrix}
      />
    </div>
  );
} 