const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

function generateUUID() {
  return crypto.randomUUID()
}

function addIdsToSection(sectionData) {
  // Force regenerate all IDs with UUIDs
  sectionData.categories = sectionData.categories.map((category, categoryIndex) => {
    category.id = generateUUID()
    
    // Add IDs to commands
    if (category.commands) {
      category.commands = category.commands.map((command, commandIndex) => {
        command.id = generateUUID()
        return command
      })
    }
    
    // Add IDs to subsection commands
    if (category.subsections) {
      category.subsections = category.subsections.map((subsection, subsectionIndex) => {
        subsection.id = generateUUID()
        
        subsection.commands = subsection.commands.map((command, commandIndex) => {
          command.id = generateUUID()
          return command
        })
        
        return subsection
      })
    }
    
    return category
  })
  
  return sectionData
}

// Process all section files
const sectionsDir = path.join(__dirname, '../data/sections')
const files = fs.readdirSync(sectionsDir).filter(file => file.endsWith('.json'))

files.forEach(file => {
  const filePath = path.join(sectionsDir, file)
  console.log(`Processing ${file}...`)
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const updatedData = addIdsToSection(data)
    
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2))
    console.log(`✅ Updated ${file} with UUIDs`)
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message)
  }
})

console.log('Done! All files have been updated with UUID-based IDs.')
