import Link from 'next/link'
import { ArrowRight, Download, Users } from 'lucide-react'

export default function FeaturesCTA() {
  return (
    <section className="mt-16 mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-[2px]">
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Compare AI Coding Agents?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Use our comprehensive feature comparison to find the perfect AI coding assistant for your workflow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 
                         hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 mr-2" />
                Compare All Agents
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 
                         hover:bg-gray-700 text-gray-200 font-medium rounded-lg transition-colors"
              >
                View All Agents
              </Link>
              
              <a
                href="/api/feature"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-700 
                         hover:border-gray-600 text-gray-300 hover:text-gray-200 font-medium 
                         rounded-lg transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Raw Data (JSON)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 