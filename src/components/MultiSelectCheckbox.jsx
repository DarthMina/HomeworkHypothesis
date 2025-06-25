const MultiSelectCheckbox = ({ options, selectedValues, onChange, label }) => {
  const handleToggle = (value) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onChange(newSelected)
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white/80 border border-gray-200"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => handleToggle(option)}
              className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
            />
            <span className="text-sm text-gray-800">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default MultiSelectCheckbox 