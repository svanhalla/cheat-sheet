'use client'

import { useState, useEffect } from 'react'
import { useHashHighlight, useHashExpand } from '../hooks/useHashHighlight'
import { Command } from '../utils/loadSections'

interface Subsection {
  title: string
  commands: Command[]
}

interface CommandItemProps {
  cmd: Command
  index: number
  prefix: string
  copied: string | null
  onCopy: (text: string, id: string) => void
}

function CommandItem({ cmd, index, prefix, copied, onCopy }: CommandItemProps) {
  const [isHighlighted, setIsHighlighted] = useState(false)
  
  const id = `${prefix}${index}`
  const showCopy = cmd.copyable !== false
  
  // Use the UUID directly from the command
  const commandId = cmd.uuid

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.slice(1)
      if (commandId && hash === commandId) {
        setIsHighlighted(true)
        setTimeout(() => {
          document.getElementById(commandId)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }, 300)
        setTimeout(() => setIsHighlighted(false), 4000)
      }
    }
    
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [commandId])

  const getCommandStyles = () => {
    switch (cmd.type) {
      case 'terminal':
        return 'bg-gray-900 text-green-400'
      case 'instruction':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCommandPrefix = () => {
    switch (cmd.type) {
      case 'terminal':
        return '$ '
      case 'instruction':
        return '📁 '
      default:
        return ''
    }
  }

  return (
    <div 
      id={commandId || undefined}
      className={`bg-gray-50 rounded-lg p-4 transition-all duration-700 ${
        isHighlighted ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {showCopy ? (
              <div className={`px-3 py-1 rounded font-mono text-sm ${getCommandStyles()}`}>
                {getCommandPrefix()}{cmd.command}
              </div>
            ) : (
              <span className={`px-3 py-1 rounded font-mono text-sm ${getCommandStyles()}`}>
                {getCommandPrefix()}{cmd.command}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm">{cmd.description}</p>
        </div>
        {showCopy && (
          <button
            onClick={() => onCopy(cmd.command, id)}
            className={`ml-3 px-3 py-1 text-xs rounded transition-colors ${
              copied === id
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {copied === id ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  )
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
  sectionId?: string
  categoryIndex?: number
}

export default function WorkflowStep({ 
  stepNumber, 
  title, 
  purpose, 
  commands = [], 
  subsections = [],
  isFileEdit = false,
  isPublishStep = false,
  defaultExpanded = false,
  sectionId,
  categoryIndex
}: WorkflowStepProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [expandedSubsections, setExpandedSubsections] = useState<Set<number>>(new Set())

  // Create URL-friendly ID from title
  const stepId = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
  
  // Only highlight if hash matches exactly this step (not commands)
  const [isHighlighted, setIsHighlighted] = useState(false)
  
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.slice(1)
      // Only highlight if exact match and NOT a command
      if (hash === stepId && !hash.startsWith('command-')) {
        setIsHighlighted(true)
        setTimeout(() => setIsHighlighted(false), 4000)
      }
    }
    
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [stepId])
  
  const shouldExpand = useHashExpand(stepId, sectionId, categoryIndex?.toString())
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || shouldExpand)

  // Check if a UUID hash belongs to this step's commands
  useEffect(() => {
    const checkUUIDExpansion = () => {
      const hash = window.location.hash.slice(1)
      
      // Check if hash is a UUID and belongs to our commands
      if (hash.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        // Check direct commands
        const directCommandExists = commands.some(cmd => cmd.uuid === hash)
        
        // Check subsection commands
        const subsectionCommandExists = subsections.some(subsection => 
          subsection.commands.some(cmd => cmd.uuid === hash)
        )
        
        if (directCommandExists || subsectionCommandExists) {
          setIsExpanded(true)
        }
      }
    }
    
    checkUUIDExpansion()
    window.addEventListener('hashchange', checkUUIDExpansion)
    return () => window.removeEventListener('hashchange', checkUUIDExpansion)
  }, [commands, subsections])

  // Update expansion when shouldExpand changes
  useEffect(() => {
    if (shouldExpand) setIsExpanded(true)
  }, [shouldExpand])

  // Handle command highlighting and scrolling
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash.startsWith('command-') && sectionId && categoryIndex !== undefined) {
      // Check if this hash belongs to this WorkflowStep
      if (hash.startsWith(`command-${sectionId}-${categoryIndex}`)) {
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }, 300)
      }
    }
  }, [sectionId, categoryIndex])

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

  const renderCommands = (commandList: Command[], prefix: string = '', subsectionIndex?: number) => (
    commandList.map((cmd, index) => (
      <CommandItem
        key={index}
        cmd={cmd}
        index={index}
        prefix={prefix}
        copied={copied}
        onCopy={copyToClipboard}
      />
    ))
  )

  return (
    <div id={stepId} className={`rounded-lg shadow-sm border mb-6 transition-all duration-700 ${
      isHighlighted 
        ? 'border-blue-500 shadow-xl bg-gradient-to-r from-blue-50 to-blue-100 scale-[1.02]' 
        : isPublishStep 
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
