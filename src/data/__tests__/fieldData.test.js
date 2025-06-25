import { fieldData } from '../fieldData'

describe('fieldData', () => {
  test('should contain all required fields', () => {
    const expectedFields = [
      'physics',
      'chemistry', 
      'biology',
      'math',
      'computerScience',
      'astronomy',
      'medicalScience'
    ]
    
    expectedFields.forEach(field => {
      expect(fieldData).toHaveProperty(field)
    })
  })

  test('should have correct structure for each field', () => {
    Object.values(fieldData).forEach(field => {
      expect(field).toHaveProperty('name')
      expect(field).toHaveProperty('emojis')
      expect(typeof field.name).toBe('string')
      expect(Array.isArray(field.emojis)).toBe(true)
      expect(field.emojis.length).toBeGreaterThan(0)
    })
  })

  test('should have unique field names', () => {
    const names = Object.values(fieldData).map(field => field.name)
    const uniqueNames = new Set(names)
    expect(names.length).toBe(uniqueNames.size)
  })

  test('should have emoji arrays with valid emojis', () => {
    Object.values(fieldData).forEach(field => {
      field.emojis.forEach(emoji => {
        expect(typeof emoji).toBe('string')
        expect(emoji.length).toBeGreaterThan(0)
      })
    })
  })

  test('should have specific field values', () => {
    expect(fieldData.physics).toEqual({
      name: 'Physics',
      emojis: ['⚛️', '🌌', '⚡', '🔬', '🌊', '💫', '🔄', '⚙️', '🔋', '🌍']
    })
    
    expect(fieldData.chemistry).toEqual({
      name: 'Chemistry',
      emojis: ['🧪', '⚗️', '🔬', '💊', '🧬', '⚛️', '🔥', '💧', '🧫', '🔋']
    })
    
    expect(fieldData.biology).toEqual({
      name: 'Biology',
      emojis: ['🧬', '🦠', '🌱', '🦋', '🐾', '🔬', '🧪', '🩺', '🌿', '🦎']
    })
    
    expect(fieldData.math).toEqual({
      name: 'Mathematics',
      emojis: ['📐', '📊', '🔢', '📈', '🧮', '📏', '🔺', '⭕', '📐', '📊']
    })
  })

  test('should have appropriate emoji representations for each field', () => {
    const emojiMap = {
      physics: ['⚛️', '🌌', '⚡', '🔬', '🌊', '💫', '🔄', '⚙️', '🔋', '🌍'],
      chemistry: ['🧪', '⚗️', '🔬', '💊', '🧬', '⚛️', '🔥', '💧', '🧫', '🔋'],
      biology: ['🧬', '🦠', '🌱', '🦋', '🐾', '🔬', '🧪', '🩺', '🌿', '🦎'],
      math: ['📐', '📊', '🔢', '📈', '🧮', '📏', '🔺', '⭕', '📐', '📊'],
      computerScience: ['💻', '🖥️', '⌨️', '🖱️', '🔧', '⚙️', '🌐', '📱', '🤖', '💾'],
      astronomy: ['🌌', '🌍', '🌙', '⭐', '🚀', '🔭', '🌠', '☄️', '🪐', '🌌'],
      medicalScience: ['🩺', '💊', '🩻', '🧬', '🔬', '🫀', '🧠', '🦴', '🩸', '💉']
    }
    
    Object.entries(emojiMap).forEach(([field, expectedEmojis]) => {
      expect(fieldData[field].emojis).toEqual(expectedEmojis)
    })
  })

  test('should have appropriate field names', () => {
    const nameMap = {
      physics: 'Physics',
      chemistry: 'Chemistry',
      biology: 'Biology',
      math: 'Mathematics',
      computerScience: 'Computer Science',
      astronomy: 'Astronomy',
      medicalScience: 'Medical Science'
    }
    
    Object.entries(nameMap).forEach(([field, expectedName]) => {
      expect(fieldData[field].name).toBe(expectedName)
    })
  })

  test('should have exactly 10 emojis per field', () => {
    Object.values(fieldData).forEach(field => {
      expect(field.emojis).toHaveLength(10)
    })
  })
}) 