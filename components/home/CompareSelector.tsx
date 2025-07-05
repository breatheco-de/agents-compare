'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Agent, Feature } from '@/types';
import { ChevronDown, X } from 'lucide-react';

interface CompareSelectorProps {
  agents: Agent[];
  features: Feature[];
}

function MultiSelectDropdown({ 
  options, 
  selectedValues, 
  onChange, 
  placeholder,
  label
}: {
  options: Array<{ value: string; label: string }>
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder: string
  label: string
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(search.toLowerCase())
  );
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };
  
  const selectedLabels = options
    .filter(opt => selectedValues.includes(opt.value))
    .map(opt => opt.label);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg 
                   text-gray-100 text-left flex items-center justify-between
                   hover:border-gray-500 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
      >
        <span className="truncate">
          {selectedLabels.length > 0 
            ? `${selectedLabels.length} selected` 
            : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-xl">
          <div className="p-2 border-b border-gray-700">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded 
                         text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-400 text-sm">No results found</div>
            ) : (
              filteredOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    className="mr-3 h-4 w-4 text-white bg-gray-700 border-gray-600 rounded 
                               focus:ring-2 focus:ring-white focus:ring-offset-0"
                  />
                  <span className="text-gray-100">{option.label}</span>
                </label>
              ))
            )}
          </div>
          
          {selectedValues.length > 0 && (
            <div className="p-2 border-t border-gray-700">
              <button
                onClick={() => {
                  onChange([]);
                  setSearch('');
                }}
                className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
      
      {selectedValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedLabels.map((label, index) => (
            <span
              key={selectedValues[index]}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 border border-gray-700"
            >
              {label}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(selectedValues[index]);
                }}
                className="ml-1 hover:text-gray-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CompareSelector({ agents, features }: CompareSelectorProps) {
  const router = useRouter();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleCompare = () => {
    const params = new URLSearchParams();
    
    if (selectedAgents.length > 0) {
      params.append('agents', selectedAgents.join(','));
    }
    
    if (selectedFeatures.length > 0) {
      params.append('features', selectedFeatures.join(','));
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/compare?${queryString}` : '/compare');
  };

  const agentOptions = agents.map(agent => ({
    value: agent.id,
    label: agent.name
  }));

  const featureOptions = features.map(feature => ({
    value: feature.id,
    label: feature.name
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <MultiSelectDropdown
          options={agentOptions}
          selectedValues={selectedAgents}
          onChange={setSelectedAgents}
          placeholder="Select agents to compare"
          label="Choose Agents"
        />

        <MultiSelectDropdown
          options={featureOptions}
          selectedValues={selectedFeatures}
          onChange={setSelectedFeatures}
          placeholder="Select features to compare"
          label="Choose Features"
        />
      </div>

      {/* Compare Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleCompare}
          disabled={selectedAgents.length === 0 && selectedFeatures.length === 0}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent 
                     text-base font-medium rounded-lg text-black bg-white hover:bg-gray-100 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Compare Selected
        </button>
      </div>
    </div>
  );
} 