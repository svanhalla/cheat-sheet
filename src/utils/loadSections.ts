import fs from 'fs'
import path from 'path'
import cheatSheetsIndex from '../../data/cheat-sheets.json'

export interface Command {
  command: string
  description: string
  copyable?: boolean
}

export interface Subsection {
  title: string
  commands: Command[]
}

export interface Category {
  title: string
  purpose?: string
  commands?: Command[]
  subsections?: Subsection[]
  isPublishStep?: boolean
}

export interface Section {
  id: string
  title: string
  description: string
  icon: string
  categories: Category[]
}

export function loadAllSections(): Section[] {
  const dataDir = path.join(process.cwd(), 'data')
  
  return cheatSheetsIndex.sections.map(sectionPath => {
    const fullPath = path.join(dataDir, sectionPath)
    const fileContent = fs.readFileSync(fullPath, 'utf8')
    return JSON.parse(fileContent) as Section
  })
}

export function loadSection(sectionId: string): Section | null {
  const sections = loadAllSections()
  return sections.find(section => section.id === sectionId) || null
}
