import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeComparisonSlug(agent1: string, agent2: string): string {
  const slugs = [slugify(agent1), slugify(agent2)].sort()
  return `${slugs[0]}-vs-${slugs[1]}`
}

export function formatSupportLevel(level: string): string {
  const levelMap = {
    yes: 'Full Support',
    partial: 'Partial Support', 
    no: 'No Support',
    unknown: 'Unknown'
  }
  return levelMap[level as keyof typeof levelMap] || level
}

export function getSupportLevelColor(level: string): string {
  const colorMap = {
    yes: 'text-green-400',
    partial: 'text-yellow-400',
    no: 'text-red-400', 
    unknown: 'text-gray-400'
  }
  return colorMap[level as keyof typeof colorMap] || 'text-gray-400'
}

export function getSupportLevelBgColor(level: string): string {
  const colorMap = {
    yes: 'bg-green-400/10 border-green-400/20',
    partial: 'bg-yellow-400/10 border-yellow-400/20',
    no: 'bg-red-400/10 border-red-400/20',
    unknown: 'bg-gray-400/10 border-gray-400/20'
  }
  return colorMap[level as keyof typeof colorMap] || 'bg-gray-400/10 border-gray-400/20'
} 