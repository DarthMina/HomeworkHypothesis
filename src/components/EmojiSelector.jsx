import { useState } from 'react'
import { fieldData } from '../data/fieldData'

const EmojiSelector = ({ onSelect, selectedField, selectedEmoji }) => {
  const [expandedField, setExpandedField] = useState(null)

  const handleFieldClick = (fieldKey) => {
    if (expandedField === fieldKey) {
      setExpandedField(null)
    } else {
      setExpandedField(fieldKey)
    }
  }

  const handleEmojiSelect = (fieldKey, emoji) => {
    onSelect({ fieldKey, emoji })
    setExpandedField(null)
  }

  return (
    <div className="space-y-3" data-testid="emoji-selector">
      {Object.entries(fieldData).map(([key, field]) => (
        <div key={key} className="border border-white/20 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => handleFieldClick(key)}
            className={`w-full p-3 flex items-center justify-between transition-all duration-200 ${
              expandedField === key ? 'bg-white/10' : 'hover:bg-white/5'
            } ${selectedField === key ? 'border-l-4 border-l-primary' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{field.emojis[0]}</span>
              <span className="text-sm font-medium text-white">{field.name}</span>
            </div>
            <span className="text-white/70">
              {expandedField === key ? '▼' : '▶'}
            </span>
          </button>
          
          {expandedField === key && (
            <div className="p-3 bg-white/5 border-t border-white/10">
              <div className="grid grid-cols-5 gap-2">
                {field.emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiSelect(key, emoji)}
                    className={`p-2 rounded-lg text-2xl transition-all duration-200 hover:scale-110 ${
                      selectedField === key && selectedEmoji === emoji
                        ? 'bg-primary/30 border-2 border-primary'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default EmojiSelector 