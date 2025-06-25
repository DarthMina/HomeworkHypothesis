const ColorBorderCard = ({ children, color, className = '', ...props }) => {
  return (
    <div
      className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${className}`}
      style={{
        borderColor: color,
        borderWidth: '3px',
        borderStyle: 'solid'
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default ColorBorderCard 