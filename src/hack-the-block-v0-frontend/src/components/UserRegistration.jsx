import React, { useState } from 'react';
import './UserRegistration.css';

/**
 * Component for user registration/username setup
 * @param {Object} props Component properties
 * @param {Function} props.onComplete Callback function when registration is complete
 * @param {string} props.currentUsername Current username if exists
 * @param {Function} props.onCancel Callback function when user cancels
 */
const UserRegistration = ({ onComplete, currentUsername = '', onCancel }) => {
  const [username, setUsername] = useState(currentUsername);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    // Username validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    
    if (username.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }
    
    // Only allow alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would call your backend
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call the completion handler with the new username
      onComplete(username);
    } catch (error) {
      console.error('Error updating username:', error);
      setError('Failed to update username. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="user-registration-overlay">
      <div className="user-registration-modal">
        <h2>{currentUsername ? 'Update Username' : 'Set Your Username'}</h2>
        <p className="registration-description">
          {currentUsername 
            ? 'Change your username to update how others see you in the platform.' 
            : 'Choose a username that will identify you in the platform.'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isLoading}
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading 
                ? 'Saving...' 
                : currentUsername ? 'Update Username' : 'Set Username'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration; 