const fs = require('fs')
const path = require('path')

function renameIdsToUuids(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => renameIdsToUuids(item))
  } else if (obj && typeof obj === 'object') {
    const newObj = {}
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'id' && typeof value === 'string' && value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        // Rename UUID id fields to uuid
        newObj['uuid'] = value
      } else {
        // Keep other fields as is, but recursively process objects
        newObj[key] = renameIdsToUuids(value)
      }
    }
    return newObj
  }
  return obj
}

// Process all section files
const sectionsDir = path.join(__dirname, '../data/sections')
const files = fs.readdirSync(sectionsDir).filter(file => file.endsWith('.json'))

files.forEach(file => {
  const filePath = path.join(sectionsDir, file)
  console.log(`Processing ${file}...`)
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const updatedData = renameIdsToUuids(data)
    
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2))
    console.log(`✅ Renamed id fields to uuid in ${file}`)
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message)
  }
})

console.log('Done! All id fields have been renamed to uuid.')
