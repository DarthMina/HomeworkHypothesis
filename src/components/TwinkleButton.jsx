import { useState } from 'react'

const TwinkleButton = ({ children, className = '', onClick, type = 'button', ...props }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
      
      {/* Twinkling stars on hover */}
      {isHovered && (
        <>
          <div 
            className="twinkle-star"
            style={{
              left: '20%',
              top: '30%',
              animationDelay: '0s'
            }}
          />
          <div 
            className="twinkle-star"
            style={{
              left: '80%',
              top: '20%',
              animationDelay: '0.5s'
            }}
          />
          <div 
            className="twinkle-star"
            style={{
              left: '60%',
              top: '70%',
              animationDelay: '1s'
            }}
          />
          <div 
            className="twinkle-star"
            style={{
              left: '10%',
              top: '80%',
              animationDelay: '1.5s'
            }}
          />
        </>
      )}
    </button>
  )
}

export default TwinkleButton 