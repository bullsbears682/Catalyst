import React from 'react'

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', overlay = false }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-3'
  }

  const spinnerContent = (
    <div className="loading-content">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      {message && <div className="loading-message">{message}</div>}
    </div>
  )

  if (overlay) {
    return (
      <div className="loading-overlay">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}

export default LoadingSpinner