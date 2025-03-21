import React, { useState } from 'react';

/**
 * Component for interacting with the ICP backend canister
 * @param {Object} props - Component props
 * @param {Object} props.actor - The authenticated backend actor
 * @returns {JSX.Element} Backend interaction component
 */
function BackendInteraction({ actor }) {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [interactions, setInteractions] = useState(0);

  /**
   * Calls the greet function on the backend canister
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!actor) {
        throw new Error('Backend actor not available');
      }

      const result = await actor.greet(name || 'World');
      setGreeting(result);
      setInteractions(prev => prev + 1);
    } catch (err) {
      console.error('Error calling backend:', err);
      setError(`Failed to call backend: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backend-interaction">
      <div className="interaction-header">
        <h2>Test Backend Connection</h2>
        {interactions > 0 && (
          <div className="interaction-badge">
            {interactions} interaction{interactions !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <p className="description">
        Welcome to your dashboard! This interface demonstrates how your frontend connects to the Internet Computer blockchain backend by calling the <code>greet</code> method.
      </p>
      
      <div className="card-container">
        <div className="interaction-card">
          <div className="card-header">
            <h3>Send a Greeting</h3>
            <span className="card-badge">Canister Method</span>
          </div>
          
          <form onSubmit={handleSubmit} className="interaction-form">
            <div className="form-group">
              <label htmlFor="name-input">Your name</label>
              <div className="input-with-button">
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={isLoading}
                  className="name-input"
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="submit-button"
                >
                  {isLoading ? (
                    <span className="loading-indicator">
                      <svg className="spinner" viewBox="0 0 50 50">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Get Greeting'}
                </button>
              </div>
            </div>
          </form>
          
          <div className="card-footer">
            <div className="helper-text">
              This will call the <code>greet</code> method on your backend canister
            </div>
          </div>
        </div>

        {(greeting || error) && (
          <div className="response-card">
            <div className="card-header">
              <h3>Response</h3>
              <span className="card-badge">{error ? 'Error' : 'Success'}</span>
            </div>
            
            {greeting && (
              <div className="result success">
                <h4>Response from backend:</h4>
                <p className="response">{greeting}</p>
                <div className="timestamp">
                  Received at {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}
            
            {error && (
              <div className="result error">
                <h4>Error Details:</h4>
                <p className="error-message">{error}</p>
                <div className="timestamp">
                  Error occurred at {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="action-bar">
        <button 
          className="action-button"
          onClick={() => {
            setGreeting('');
            setError('');
            setName('');
          }}
          disabled={!greeting && !error}
        >
          Clear Results
        </button>
        
        <div className="api-info">
          <span className="api-badge">API Status:</span> 
          <span className="api-status online">Online</span>
        </div>
      </div>
    </div>
  );
}

export default BackendInteraction; 