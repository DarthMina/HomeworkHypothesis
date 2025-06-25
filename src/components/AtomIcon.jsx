const AtomIcon = ({ size = "w-8 h-8", color = "text-blue-500", className = "" }) => {
  return (
    <div 
      className={`${size} ${color} ${className} animate-spin`}
      data-testid="atom-icon"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6M1 12h6m6 0h6"/>
      </svg>
    </div>
  )
}

export default AtomIcon 