import { useEffect } from 'react'

export const Drawer = ({ 
  isOpen, 
  onClose, 
  children, 
  position = 'right', 
  width = 'w-80',
  title,
  showBackdrop = true,
  className = ''
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-0 top-0 h-full'
      case 'right':
        return 'right-0 top-0 h-full'
      case 'top':
        return 'top-0 left-0 right-0 w-full'
      case 'bottom':
        return 'bottom-0 left-0 right-0 w-full'
      default:
        return 'right-0 top-0 h-full'
    }
  }

  const getTransformClasses = () => {
    switch (position) {
      case 'left':
        return isOpen ? 'translate-x-0' : '-translate-x-full'
      case 'right':
        return isOpen ? 'translate-x-0' : 'translate-x-full'
      case 'top':
        return isOpen ? 'translate-y-0' : '-translate-y-full'
      case 'bottom':
        return isOpen ? 'translate-y-0' : 'translate-y-full'
      default:
        return isOpen ? 'translate-x-0' : 'translate-x-full'
    }
  }

  const getSizeClasses = () => {
    if (position === 'top' || position === 'bottom') {
      return 'h-96' 
    }
    return width
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden  ">
      {showBackdrop && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={handleBackdropClick}
        />
      )}
      
      <div 
        className={`
          absolute ${getPositionClasses()} 
          ${getSizeClasses()} 
          bg-white shadow-xl 
          transform transition-transform duration-300 ease-in-out
          ${getTransformClasses()}
          ${className}
          
        `}
        style={{
          height: (position === 'left' || position === 'right') ? '100vh' : undefined,
          maxHeight: '100vh',
        }}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close drawer"
            >
              <svg 
                className="w-5 h-5 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        )}
        
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
