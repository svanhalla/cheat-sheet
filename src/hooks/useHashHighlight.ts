import { useState, useEffect } from 'react'

export function useHashHighlight(targetId: string) {
  const [isHighlighted, setIsHighlighted] = useState(false)

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.slice(1)
      console.log('useHashHighlight checking:', hash, 'vs', targetId)
      if (hash === targetId && targetId) {
        console.log('HIGHLIGHTING:', targetId)
        setIsHighlighted(true)
        // Scroll to element - use 'start' for sections, 'center' for commands
        const scrollBlock = targetId.startsWith('command-') ? 'center' : 'start'
        setTimeout(() => {
          const element = document.getElementById(targetId)
          console.log('Scrolling to element:', element, 'with ID:', targetId)
          element?.scrollIntoView({
            behavior: 'smooth',
            block: scrollBlock
          })
        }, 200)
        // Remove highlight after 4 seconds
        setTimeout(() => setIsHighlighted(false), 4000)
      }
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [targetId])

  return isHighlighted
}

export function useHashExpand(targetId: string, sectionId?: string, categoryId?: string) {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.slice(1)
      
      // Expand if hash matches exactly
      if (hash === targetId) {
        setIsExpanded(true)
        return
      }
      
      // For UUIDs, we need to check if this UUID belongs to this section
      // We'll let the individual components handle UUID expansion
      // This hook should only handle exact matches
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [targetId, sectionId, categoryId])

  return isExpanded
}
