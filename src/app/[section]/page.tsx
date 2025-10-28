import Link from 'next/link'
import { notFound } from 'next/navigation'
import cheatSheets from '../../../data/cheat-sheets.json'
import CodeBlock from '../../components/CodeBlock'
import WorkflowStep from '../../components/WorkflowStep'
import CollapsibleSection from '../../components/CollapsibleSection'

interface PageProps {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return cheatSheets.sections.map((section) => ({
    section: section.id,
  }))
}

export default async function SectionPage({ params }: PageProps) {
  const { section: sectionId } = await params
  const section = cheatSheets.sections.find(s => s.id === sectionId)
  
  if (!section) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-primary hover:text-primary/80">
                ← Back
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{section.icon}</span>
                <h1 className="text-3xl font-bold text-primary">{section.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {section.id === 'maggie-workflows' ? (
            // Special workflow layout for Maggie
            <div className="space-y-6">
              {section.categories.map((category, categoryIndex) => (
                <WorkflowStep
                  key={categoryIndex}
                  stepNumber={categoryIndex + 1}
                  title={category.title}
                  purpose={category.purpose || ''}
                  commands={category.commands || []}
                  subsections={category.subsections || []}
                  isFileEdit={category.title.includes('Making Content Changes')}
                  isPublishStep={category.isPublishStep || false}
                  defaultExpanded={categoryIndex === 0}
                />
              ))}
            </div>
          ) : (
            // Collapsible sections for other pages
            <div className="space-y-6">
              {section.categories.map((category, categoryIndex) => (
                <CollapsibleSection
                  key={categoryIndex}
                  title={category.title}
                  commands={category.commands}
                  defaultExpanded={categoryIndex === 0}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
