'use client'

import { useState } from 'react'
import CodeBlock from './CodeBlock'

interface Command {
  command: string
  description: string
  type?: 'terminal' | 'instruction' | 'code'
  copyable?: boolean
}

interface CollapsibleSectionProps {
  title: string
  commands: Command[]
  defaultExpanded?: boolean
}

export default function CollapsibleSection({ 
  title, 
  commands, 
  defaultExpanded = false 
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
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
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
