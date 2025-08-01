import React from 'react'

const ErrorMessage = ({ message, onClose, type = 'error' }) => {
  return (
    <div className={`message message-${type}`} role="alert">
      <div className="message-content">
        <span className="message-icon">
          {type === 'error' && '⚠️'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className="message-text">{message}</span>
      </div>
      {onClose && (
        <button 
          className="message-close" 
          onClick={onClose}
          aria-label="Close message"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default ErrorMessage