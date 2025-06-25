const XPBar = ({ xp, level }) => {
  const progress = (xp % 100) / 100 * 100
  const nextLevelXP = level * 100
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Level {level}</span>
        <span>{xp} / {nextLevelXP} XP</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default XPBar 