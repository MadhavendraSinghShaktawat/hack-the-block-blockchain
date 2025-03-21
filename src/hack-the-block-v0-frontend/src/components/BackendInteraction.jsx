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

  /**
   * Calls the greet function on the backend canister
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGreeting('');

    try {
      if (!actor) {
        throw new Error('Backend actor not available');
      }

      const result = await actor.greet(name || 'World');
      setGreeting(result);
    } catch (err) {
      console.error('Error calling backend:', err);
      setError(`Failed to call backend: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backend-interaction">
      <h2>Test Backend Connection</h2>
      <p className="description">
        This simple form demonstrates canister interaction by calling the <code>greet</code> method.
      </p>
      
      <form onSubmit={handleSubmit} className="interaction-form">
        <div className="form-group">
          <label htmlFor="name-input">Your name:</label>
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
              {isLoading ? 'Calling...' : 'Get Greeting'}
            </button>
          </div>
        </div>
      </form>
      
      {greeting && (
        <div className="result success">
          <h3>Response from backend:</h3>
          <p className="response">{greeting}</p>
        </div>
      )}
      
      {error && (
        <div className="result error">
          <h3>Error:</h3>
          <p className="error-message">{error}</p>
        </div>
      )}
    </div>
  );
}

export default BackendInteraction; 