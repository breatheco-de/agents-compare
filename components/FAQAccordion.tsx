'use client'

import React, { useState } from 'react'
import type { FAQ } from '@/types'

interface FAQAccordionProps {
  faqs: FAQ[]
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleItem(index)
    }
  }

  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <div className="space-y-3" data-component="accordion">
      {faqs.map((faq, index) => {
        const isExpanded = expandedItems.has(index)
        const triggerId = `faq-trigger-${index}`
        const contentId = `faq-${index}`

        return (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 transition-colors hover:border-gray-600"
          >
            <h3>
              <button
                id={triggerId}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-medium text-gray-200 hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </h3>
            
            <div
              id={contentId}
              aria-labelledby={triggerId}
              hidden={!isExpanded}
              className={`${isExpanded ? '' : 'hidden'}`}
            >
              <div className="px-6 pb-4 text-gray-300">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 