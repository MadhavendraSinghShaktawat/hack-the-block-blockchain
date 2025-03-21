import React, { useState, useEffect } from 'react';
import { hasUsername } from '../services/userService';
import UserRegistration from './UserRegistration';
import './UsernamePrompt.css';

/**
 * Component that prompts users to set their username if not already set
 * Can be placed on dashboard or other prominent areas
 * 
 * @param {Object} props Component properties
 * @param {Function} props.onUsernameSet Callback when username is set successfully
 */
const UsernamePrompt = ({ onUsernameSet }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkUsername = async () => {
      try {
        setLoading(true);
        const hasUsernameSaved = await hasUsername();
        setShowPrompt(!hasUsernameSaved);
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUsername();
  }, []);
  
  const handleSetUsername = async (username) => {
    try {
      // onUsernameSet will handle the actual saving
      if (onUsernameSet) {
        await onUsernameSet(username);
      }
      setShowRegistration(false);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error saving username:', error);
    }
  };
  
  if (loading || !showPrompt) {
    return null;
  }
  
  return (
    <>
      <div className="username-prompt">
        <div className="prompt-content">
          <div className="prompt-icon">👤</div>
          <div className="prompt-text">
            <h3>Set Your Username</h3>
            <p>Setting a username helps others identify you in the platform and makes collaboration easier.</p>
          </div>
          <div className="prompt-actions">
            <button 
              className="dismiss-button" 
              onClick={() => setShowPrompt(false)}
            >
              Later
            </button>
            <button 
              className="setup-button" 
              onClick={() => setShowRegistration(true)}
            >
              Set Username
            </button>
          </div>
        </div>
      </div>
      
      {showRegistration && (
        <UserRegistration 
          onComplete={handleSetUsername}
          onCancel={() => setShowRegistration(false)}
        />
      )}
    </>
  );
};

export default UsernamePrompt; 