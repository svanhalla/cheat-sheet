'use client'

import { useState } from 'react'

interface Command {
  command: string
  description: string
  copyable?: boolean
}

interface Subsection {
  title: string
  commands: Command[]
}

interface WorkflowStepProps {
  stepNumber: number
  title: string
  purpose: string
  commands?: Command[]
  subsections?: Subsection[]
  isFileEdit?: boolean
  isPublishStep?: boolean
  defaultExpanded?: boolean
}

export default function WorkflowStep({ 
  stepNumber, 
  title, 
  purpose, 
  commands = [], 
  subsections = [],
  isFileEdit = false,
  isPublishStep = false,
  defaultExpanded = false 
}: WorkflowStepProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [expandedSubsections, setExpandedSubsections] = useState<Set<number>>(new Set())

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleSubsection = (index: number) => {
    const newExpanded = new Set(expandedSubsections)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSubsections(newExpanded)
  }

  const renderCommands = (commandList: Command[], prefix: string = '') => (
    commandList.map((cmd, index) => {
      const id = `${prefix}${index}`
      const showCopy = cmd.copyable !== false // Default to true unless explicitly false
      return (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                {showCopy ? (
                  isFileEdit ? (
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono text-sm">
                      📁 {cmd.command}
                    </div>
                  ) : (
                    <div className="bg-gray-900 text-green-400 px-3 py-1 rounded font-mono text-sm">
                      $ {cmd.command}
                    </div>
                  )
                ) : (
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-mono text-sm">
                    💡 {cmd.command}
                  </div>
                )}
                {showCopy && (
                  <button
                    onClick={() => copyToClipboard(cmd.command, id)}
                    className="ml-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    title={copied === id ? "Copied!" : "Copy to clipboard"}
                  >
                    {copied === id ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                        <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                      </svg>
                    )}
                  </button>
                )}
              </div>
              <p className="text-gray-600 text-sm">{cmd.description}</p>
            </div>
          </div>
        </div>
      )
    })
  )

  return (
    <div className={`rounded-lg shadow-sm border mb-6 ${
      isPublishStep 
        ? 'bg-red-50 border-red-200' 
        : 'bg-white border-gray-200'
    }`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm mr-3 ${
              isPublishStep 
                ? 'bg-red-600 text-white' 
                : 'bg-primary text-white'
            }`}>
              {stepNumber}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{purpose}</p>
            </div>
          </div>
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
          {/* Regular commands */}
          {commands.length > 0 && (
            <div className="space-y-3 mb-4">
              {renderCommands(commands)}
            </div>
          )}
          
          {/* Subsections */}
          {subsections.map((subsection, subsectionIndex) => (
            <div key={subsectionIndex} className="mb-4">
              <button
                onClick={() => toggleSubsection(subsectionIndex)}
                className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">{subsection.title}</h4>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${expandedSubsections.has(subsectionIndex) ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {expandedSubsections.has(subsectionIndex) && (
                <div className="mt-3 space-y-3 pl-4">
                  {renderCommands(subsection.commands, `sub-${subsectionIndex}-`)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
