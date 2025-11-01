'use client'

import { useState } from 'react'
import { useHashHighlight } from '../hooks/useHashHighlight'

interface CodeBlockProps {
  code: string
  description?: string
  type?: 'terminal' | 'instruction' | 'code'
  copyable?: boolean
  commandId?: string // Use the stable ID from JSON
}

export default function CodeBlock({ 
  code, 
  description, 
  type = 'code', 
  copyable = true,
  commandId
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  console.log('CodeBlock commandId:', commandId, 'for command:', code.substring(0, 30))
  const isHighlighted = useHashHighlight(commandId || '')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Determine styling based on command type
  const getCommandStyles = () => {
    switch (type) {
      case 'terminal':
        return 'bg-gray-900 text-green-400 border-gray-700'
      case 'instruction':
        return 'bg-blue-50 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200'
    }
  }

  const getCardStyles = () => {
    switch (type) {
      case 'terminal':
        return 'command-card border-gray-700'
      case 'instruction':
        return 'command-card border-blue-200'
      default:
        return 'command-card'
    }
  }

  return (
    <div id={commandId || undefined} className={`${getCardStyles()} transition-all duration-700 ${
      isHighlighted ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 scale-[1.02]' : ''
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`command-code flex-1 mr-3 p-3 rounded border font-mono text-sm ${getCommandStyles()}`}>
          {code}
        </div>
        {copyable && (
          <button
            onClick={copyToClipboard}
            className="relative group p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
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
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
    </div>
  )
}
