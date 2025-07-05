'use client';

import { useState } from 'react';
import { Agent, Feature } from '@/types';
import { CATEGORIES } from '@/types';
import { ChevronDown, X } from 'lucide-react';

// Searchable dropdown component
function SearchableDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder,
  label
}: {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(search.toLowerCase())
  );
  
  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                   text-gray-100 text-left flex items-center justify-between
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 bg-gray-800 border-b border-gray-700 rounded-t-lg 
                       text-gray-100 placeholder-gray-400 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearch('');
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-700 text-gray-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ComparisonFiltersProps {
  agents: Agent[];
  features: Feature[];
  selectedAgents: string[];
  setSelectedAgents: (agents: string[]) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (features: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedSupportLevels: any[];
  setSelectedSupportLevels: (levels: any[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'compact' | 'expanded';
  setViewMode: (mode: 'compact' | 'expanded') => void;
  showNotes: boolean;
  setShowNotes: (show: boolean) => void;
}

export function ComparisonFilters({
  agents,
  features,
  selectedAgents,
  setSelectedAgents,
  selectedFeatures,
  setSelectedFeatures,
  selectedCategories,
  setSelectedCategories,
  selectedSupportLevels,
  setSelectedSupportLevels,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  showNotes,
  setShowNotes
}: ComparisonFiltersProps) {
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const clearAllFilters = () => {
    setSelectedAgent('all');
    setSelectedCategory('all');
    setSelectedAgents([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters = selectedAgent !== 'all' || selectedCategory !== 'all';

  // Create options for dropdowns
  const agentOptions = [
    { value: 'all', label: 'All Agents' },
    ...agents.map(agent => ({
      value: agent.id,
      label: agent.name
    }))
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map(category => ({
      value: category,
      label: category
    }))
  ];

  // Handle agent selection
  const handleAgentChange = (value: string) => {
    setSelectedAgent(value);
    if (value === 'all') {
      setSelectedAgents([]);
    } else {
      setSelectedAgents([value]);
    }
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([value]);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Filter Comparison</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Agent Filter */}
        <SearchableDropdown
          options={agentOptions}
          value={selectedAgent}
          onChange={handleAgentChange}
          placeholder="Select an agent"
          label="Filter by Agent"
        />

        {/* Category Filter */}
        <SearchableDropdown
          options={categoryOptions}
          value={selectedCategory}
          onChange={handleCategoryChange}
          placeholder="Select a category"
          label="Filter by Category"
        />

        {/* View Mode Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">View Mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('compact')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'compact' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => setViewMode('expanded')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'expanded' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Expanded
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="border-t border-gray-800 pt-4">
          <div className="flex flex-wrap gap-2">
            {selectedAgent !== 'all' && (
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs flex items-center gap-1">
                Agent: {agentOptions.find(opt => opt.value === selectedAgent)?.label}
                <button
                  onClick={() => handleAgentChange('all')}
                  className="ml-1 hover:text-blue-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs flex items-center gap-1">
                Category: {selectedCategory}
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="ml-1 hover:text-green-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 