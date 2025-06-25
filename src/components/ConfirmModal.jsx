const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", confirmIcon = "✅", cancelIcon = "❌" }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="glass-strong p-6 rounded-2xl max-w-md w-full relative z-10">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-white/80 mb-6">{message}</p>
        
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>{cancelIcon}</span>
            <span>{cancelText}</span>
          </button>
          
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>{confirmIcon}</span>
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal 