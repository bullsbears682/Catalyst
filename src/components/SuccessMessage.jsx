import React from 'react'

const SuccessMessage = ({ message, onClose }) => {
  return (
    <div className="message message-success" role="alert">
      <div className="message-content">
        <span className="message-icon">✅</span>
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

export default SuccessMessage