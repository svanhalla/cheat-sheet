import Link from 'next/link'
import { loadAllSections } from '../utils/loadSections'

export default function Home() {
  const sections = loadAllSections()

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-primary">Developer Cheat Sheet</h1>
            <p className="text-gray-600">Quick reference for development commands</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`/${section.id}`}
              className="command-card group cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-600">{section.description}</p>
              <div className="mt-4 text-sm text-primary font-medium">
                View commands →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
