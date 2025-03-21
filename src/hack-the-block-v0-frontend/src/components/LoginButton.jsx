import React from 'react';

/**
 * Button component for handling login with Internet Identity
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether login process is loading
 * @param {Function} props.onClick - Function to call when button is clicked
 * @returns {JSX.Element} Login button component
 */
function LoginButton({ isLoading, onClick }) {
  return (
    <div className="login-container">
      <button 
        className="login-button" 
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading-indicator">
            <svg className="spinner" viewBox="0 0 50 50">
              <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
            </svg>
            <span>Connecting to Internet Identity...</span>
          </span>
        ) : (
          <span className="login-text">
            Sign in with Internet Identity
          </span>
        )}
      </button>
      <div className="login-helper-text">
        Secure, decentralized authentication powered by the Internet Computer
      </div>
    </div>
  );
}

export default LoginButton; 