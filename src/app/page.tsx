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
        {/* Special Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🛠️ Interactive Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/playground"
              className="command-card group cursor-pointer border-2 border-primary/20 hover:border-primary/40"
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">🎨</span>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  Color & Font Playground
                </h3>
              </div>
              <p className="text-gray-600">Interactive tool to test colors (RGB), fonts, and sizes with live preview</p>
              <div className="mt-4 text-sm text-primary font-medium">
                Try it out →
              </div>
            </Link>
          </div>
        </div>

        {/* Cheat Sheets Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Cheat Sheets</h2>
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
        </div>
      </main>
    </div>
  )
}
