'use client'

import { useState, useEffect, useRef } from 'react'
import { getSearchIndex, fuzzySearch, SearchItem } from '../utils/searchIndex'
import { useRouter } from 'next/navigation'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchIndex, setSearchIndex] = useState<SearchItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setSearchIndex(getSearchIndex())
  }, [])

  useEffect(() => {
    if (query.trim()) {
      const searchResults = fuzzySearch(searchIndex, query)
      setResults(searchResults)
      setSelectedIndex(0)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query, searchIndex])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    }
  }, [selectedIndex])

  const handleResultClick = (item: SearchItem) => {
    console.log('Navigating to:', item.sectionId, 'item:', item)
    
    // Always use the UUID from the search item
    const url = `/${item.sectionId}#${item.id}`
    
    console.log('Full URL:', url)
    
    // If we're already on the same page, just update the hash
    if (window.location.pathname === `/${item.sectionId}`) {
      window.location.hash = item.id
    } else {
      router.push(url)
    }
    
    setIsOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      inputRef.current?.focus()
      setIsOpen(true)
      return
    }
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
      return
    }
    if (isOpen && results.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % results.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
        return
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  const copyCommand = async (command: string) => {
    await navigator.clipboard.writeText(command)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search commands... (⌘K)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {setQuery(''); setIsOpen(false)}}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
        >
          {results.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleResultClick(item)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                      {item.sectionTitle}
                    </span>
                    {item.categoryTitle && (
                      <span className="text-xs text-gray-500">
                        → {item.categoryTitle}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </div>
                </div>
                {item.command && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyCommand(item.command!)
                    }}
                    className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Copy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
