import searchIndexData from '../data/searchIndex.json'

export interface SearchItem {
  id: string
  type: 'command' | 'category' | 'section'
  title: string
  description: string
  command?: string
  sectionId: string
  sectionTitle: string
  categoryTitle?: string
  subsectionTitle?: string
  searchText: string
}

export function getSearchIndex(): SearchItem[] {
  return searchIndexData as SearchItem[]
}

export function fuzzySearch(items: SearchItem[], query: string): SearchItem[] {
  if (!query.trim()) return []
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
  
  return items
    .map(item => {
      let score = 0
      const searchText = item.searchText
      
      searchTerms.forEach(term => {
        if (searchText.includes(term)) {
          // Exact match gets higher score
          if (item.title.toLowerCase().includes(term)) score += 10
          else if (item.command?.toLowerCase().includes(term)) score += 8
          else if (item.description.toLowerCase().includes(term)) score += 5
          else score += 2
        }
      })
      
      return { item, score }
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(result => result.item)
}
