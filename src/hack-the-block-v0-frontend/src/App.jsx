import React from 'react';
import { useAuth } from './hooks/useAuth';
import './App.css';

// Import or create components
import LoginButton from './components/LoginButton';
import BackendInteraction from './components/BackendInteraction.jsx';
import ICPLogo from './components/ICPLogo';

function App() {
  const { isAuthenticated, isLoading, principal, login, logout, backendActor } = useAuth();

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <div className="landing-page">
          <div className="bg-pattern"></div>
          <div className="landing-content">
            <h1 className="headline">Join the Future of Collaboration</h1>
            <p className="subheadline">Connect with others on ICP to build amazing projects</p>
            <LoginButton 
              isLoading={isLoading} 
              onClick={() => login({
                onSuccess: () => console.log('Login successful'),
                onError: (error) => console.error('Login failed:', error)
              })} 
            />
            <div className="powered-by">
              <ICPLogo />
              <span>Powered by Internet Computer Protocol</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="authenticated-container">
          <div className="header">
            <h1>Decentralized Collaboration Hub</h1>
            <div className="user-info">
              <p>Connected as: <span className="principal">{principal}</span></p>
              <button 
                className="logout-button"
                onClick={() => logout({
                  onSuccess: () => console.log('Logout successful'),
                  onError: (error) => console.error('Logout failed:', error)
                })}
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="content">
            <BackendInteraction actor={backendActor} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
