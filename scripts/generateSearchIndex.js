const fs = require('fs')
const path = require('path')
const { randomUUID } = require('crypto')

// Load the index file
const cheatSheetsIndex = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cheat-sheets.json'), 'utf8'))

function loadAllSections() {
  const dataDir = path.join(__dirname, '../data')
  
  const sections = cheatSheetsIndex.sections.map(sectionPath => {
    const fullPath = path.join(dataDir, sectionPath)
    const fileContent = fs.readFileSync(fullPath, 'utf8')
    const section = JSON.parse(fileContent)
    let hasChanges = false
    
    // Remove section UUID if it exists - we use id for sections
    if (section.uuid) {
      delete section.uuid
      hasChanges = true
    }
    
    // Ensure categories have UUIDs
    section.categories?.forEach(category => {
      if (!category.uuid || category.uuid.trim() === '') {
        category.uuid = randomUUID()
        hasChanges = true
      }
      
      // Ensure commands have UUIDs
      category.commands?.forEach(command => {
        if (!command.uuid || command.uuid.trim() === '') {
          command.uuid = randomUUID()
          hasChanges = true
        }
      })
      
      // Ensure subsections and their commands have UUIDs
      category.subsections?.forEach(subsection => {
        if (!subsection.uuid || subsection.uuid.trim() === '') {
          subsection.uuid = randomUUID()
          hasChanges = true
        }
        subsection.commands?.forEach(command => {
          if (!command.uuid || command.uuid.trim() === '') {
            command.uuid = randomUUID()
            hasChanges = true
          }
        })
      })
    })
    
    // Write back if changes were made
    if (hasChanges) {
      fs.writeFileSync(fullPath, JSON.stringify(section, null, 2))
    }
    
    return section
  })
  
  return sections
}

function generateSearchIndex() {
  const sections = loadAllSections()
  const items = []

  sections.forEach(section => {
    // Add section itself (using id, not uuid)
    items.push({
      id: `section-${section.id}`,
      type: 'section',
      title: section.title,
      description: section.description,
      sectionId: section.id,
      sectionTitle: section.title,
      searchText: `${section.title} ${section.description}`.toLowerCase()
    })

    section.categories.forEach(category => {
      // Add category
      items.push({
        id: category.uuid,
        type: 'category',
        title: category.title,
        description: category.purpose || '',
        sectionId: section.id,
        sectionTitle: section.title,
        categoryTitle: category.title,
        categoryId: category.uuid,
        searchText: `${category.title} ${category.purpose || ''}`.toLowerCase()
      })

      // Add direct commands in category
      category.commands?.forEach(command => {
        items.push({
          id: command.uuid,
          type: 'command',
          title: command.command,
          description: command.description,
          command: command.command,
          sectionId: section.id,
          sectionTitle: section.title,
          categoryTitle: category.title,
          categoryId: category.uuid,
          commandId: command.uuid,
          searchText: `${command.command} ${command.description}`.toLowerCase()
        })
      })

      // Add commands in subsections
      category.subsections?.forEach(subsection => {
        subsection.commands.forEach(command => {
          items.push({
            id: command.uuid,
            type: 'command',
            title: command.command,
            description: command.description,
            command: command.command,
            sectionId: section.id,
            sectionTitle: section.title,
            categoryTitle: category.title,
            categoryId: category.uuid,
            subsectionTitle: subsection.title,
            commandId: command.uuid,
            searchText: `${command.command} ${command.description} ${subsection.title}`.toLowerCase()
          })
        })
      })
    })
  })

  return items
}

// Generate and save the search index
const searchIndex = generateSearchIndex()
const outputPath = path.join(__dirname, '../src/data/searchIndex.json')

// Ensure directory exists
fs.mkdirSync(path.dirname(outputPath), { recursive: true })

fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2))
console.log(`Generated search index with ${searchIndex.length} items`)
