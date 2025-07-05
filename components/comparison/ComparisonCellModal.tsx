'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Agent, Feature } from '@/types';
import { ComparisonMatrix } from '@/types/comparison';
import SupportLevelBadge from '@/components/ui/SupportLevelBadge';

interface ComparisonCellModalProps {
  agent: Agent;
  feature: Feature;
  support: ComparisonMatrix['matrix'][string][string];
  onClose: () => void;
}

export function ComparisonCellModal({ agent, feature, support, onClose }: ComparisonCellModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {feature.name} in {agent.name}
              </h2>
              <div className="flex items-center gap-4">
                <SupportLevelBadge level={support.level} showIcon />
                <span className="text-sm text-gray-400">
                  {agent.provider} • {feature.category}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Feature Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Feature Description</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>

          {/* Support Details */}
          {support.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Implementation Details</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{support.notes}</p>
            </div>
          )}

          {/* Examples */}
          {support.examples && support.examples.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Examples</h3>
              <div className="space-y-3">
                {support.examples.map((example, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{example}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4 pt-4 border-t border-gray-800">
            <Link
              href={`/agent/${agent.id}`}
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              View {agent.name} Profile →
            </Link>
            <Link
              href={`/feature/${feature.id}`}
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              View {feature.name} Details →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-6 bg-gray-950">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Support information is based on official documentation and public information.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 