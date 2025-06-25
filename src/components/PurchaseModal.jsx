import TwinkleButton from './TwinkleButton'

const PurchaseModal = ({ isOpen, onClose, onConfirm, item, currentPoints }) => {
  if (!isOpen) return null

  const canAfford = currentPoints >= item.price

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-strong p-8 rounded-3xl max-w-md w-full animate-in slide-in-from-bottom-4">
        <div className="text-center">
          <div className="text-6xl mb-4">{item.emoji}</div>
          <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
          <p className="text-white/70 mb-4">{item.description}</p>
          
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="text-3xl font-bold text-accent mb-2">{item.price} pts</div>
            <div className="text-sm text-white/60">
              Your balance: <span className="text-primary font-semibold">{currentPoints} pts</span>
            </div>
          </div>

          {!canAfford && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6">
              <div className="text-red-400 font-semibold">❌ Insufficient Points</div>
              <div className="text-sm text-red-300">
                You need {item.price - currentPoints} more points
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <TwinkleButton
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </TwinkleButton>
            <TwinkleButton
              onClick={onConfirm}
              disabled={!canAfford}
              className={`flex-1 ${
                canAfford ? 'btn-primary' : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              {canAfford ? '🎉 Purchase!' : 'Not Enough Points'}
            </TwinkleButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseModal 