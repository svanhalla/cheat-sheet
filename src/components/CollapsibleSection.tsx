'use client'

import { useState, useEffect } from 'react'
import CodeBlock from './CodeBlock'
import { useHashHighlight, useHashExpand } from '../hooks/useHashHighlight'

interface Command {
  uuid?: string
  command: string
  description: string
  type?: 'terminal' | 'instruction' | 'code'
  copyable?: boolean
}

interface CollapsibleSectionProps {
  title: string
  commands: Command[]
  defaultExpanded?: boolean
  sectionId?: string
  categoryId?: string
}

export default function CollapsibleSection({ 
  title, 
  commands, 
  defaultExpanded = false,
  sectionId,
  categoryId
}: CollapsibleSectionProps) {
  // Create URL-friendly ID from title
  const sectionIdFromTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
  
  // Only highlight if hash matches exactly this section (not commands)
  const [isHighlighted, setIsHighlighted] = useState(false)
  
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.slice(1)
      // Check if hash matches this category's UUID or the title-based ID
      if (hash === categoryId || (hash === sectionIdFromTitle && !hash.includes('-'))) {
        setIsHighlighted(true)
        setTimeout(() => setIsHighlighted(false), 4000)
      }
    }
    
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [sectionIdFromTitle, categoryId])
  
  const shouldExpand = useHashExpand(sectionIdFromTitle, sectionId ? `${sectionId}` : undefined, categoryId)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || shouldExpand)

  // Check if a UUID hash belongs to this section's commands or is this category
  useEffect(() => {
    const checkUUIDExpansion = () => {
      const hash = window.location.hash.slice(1)
      
      // Check if hash is a UUID
      if (hash.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        // Check if it's this category's UUID or belongs to our commands
        const isThisCategory = categoryId === hash
        const commandExists = commands.some(cmd => cmd.uuid === hash)
        if (isThisCategory || commandExists) {
          setIsExpanded(true)
        }
      }
    }
    
    checkUUIDExpansion()
    window.addEventListener('hashchange', checkUUIDExpansion)
    return () => window.removeEventListener('hashchange', checkUUIDExpansion)
  }, [commands, categoryId])

  // Update expansion when shouldExpand changes
  useEffect(() => {
    if (shouldExpand) setIsExpanded(true)
  }, [shouldExpand])

  return (
    <div id={categoryId} className={`rounded-lg shadow-sm border mb-6 transition-all duration-700 ${
      isHighlighted 
        ? 'border-blue-500 shadow-xl bg-gradient-to-r from-blue-50 to-blue-100 scale-[1.02]' 
        : 'bg-white border-gray-200'
    }`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="grid gap-4">
            {commands.map((cmd, cmdIndex) => {
              const isUrl = cmd.command.startsWith('http')
              
              if (isUrl) {
                return (
                  <div key={cmdIndex} className="command-card">
                    <div className="flex items-center justify-between mb-3">
                      <a 
                        href={cmd.command}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 mr-3 bg-blue-600 text-white px-3 py-2 rounded font-mono text-sm hover:bg-blue-700 transition-colors"
                      >
                        🔗 {cmd.command}
                      </a>
                    </div>
                    <p className="text-gray-600">{cmd.description}</p>
                  </div>
                )
              }
              
              return (
                <CodeBlock
                  key={cmdIndex}
                  code={cmd.command}
                  description={cmd.description}
                  type={cmd.type || 'code'}
                  copyable={cmd.copyable !== false}
                  commandId={cmd.uuid}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
