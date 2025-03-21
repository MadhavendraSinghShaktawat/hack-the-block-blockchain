import React, { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import './App.css';
import { getUsername, saveUsername } from './services/userService';

// Import components
import LoginButton from './components/LoginButton';
import ICPLogo from './components/ICPLogo';
import Dashboard from './components/Dashboard';

/**
 * Main application component that handles authentication state and routing
 */
function App() {
  const { isAuthenticated, isLoading, principal, login, logout } = useAuth();
  const [username, setUsername] = useState(null);
  const [loadingUsername, setLoadingUsername] = useState(false);

  // Fetch username when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUsername = async () => {
        try {
          setLoadingUsername(true);
          const savedUsername = await getUsername();
          setUsername(savedUsername);
        } catch (error) {
          console.error('Error fetching username:', error);
        } finally {
          setLoadingUsername(false);
        }
      };
      
      fetchUsername();
    }
  }, [isAuthenticated]);
  
  // Handle username updates
  const handleUpdateUsername = async (newUsername) => {
    try {
      await saveUsername(newUsername);
      setUsername(newUsername);
      return true;
    } catch (error) {
      console.error('Error updating username:', error);
      return false;
    }
  };

  // Landing page for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <div className="landing-page">
          <div className="bg-pattern"></div>
          <nav className="landing-nav">
            <div className="logo">
              <ICPLogo />
              <span>CollabChain</span>
            </div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </nav>
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
            <div className="features-preview">
              <div className="feature">
                <div className="feature-icon">🔐</div>
                <h3>Secure</h3>
                <p>End-to-end encryption for all your data</p>
              </div>
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <h3>Fast</h3>
                <p>Lightning-quick responses and updates</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🌐</div>
                <h3>Decentralized</h3>
                <p>Built on the Internet Computer Protocol</p>
              </div>
            </div>
            <div className="powered-by">
              <ICPLogo />
              <span>Powered by Internet Computer Protocol</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard for authenticated users
  return (
    <div className="app-container">
      <div className="authenticated-container">
        <header className="header">
          <div className="logo-container">
            <ICPLogo />
            <h1>CollabChain</h1>
          </div>
          <div className="user-info">
            <div className="user-badge">
              <div className="user-avatar">{principal?.charAt(0) || 'U'}</div>
              <p>Connected as: <span className="principal">{username || principal?.substring(0, 10) + '...'}</span></p>
            </div>
            <button 
              className="logout-button"
              onClick={() => logout({
                onSuccess: () => console.log('Logout successful'),
                onError: (error) => console.error('Logout failed:', error)
              })}
            >
              Sign Out
            </button>
          </div>
        </header>
        
        <div className="main-layout">
          <aside className="sidebar">
            <nav className="sidebar-nav">
              <ul>
                <li className="nav-item active">
                  <span className="nav-icon">📊</span>
                  <span>Dashboard</span>
                </li>
                <li className="nav-item">
                  <span className="nav-icon">🏗️</span>
                  <span>Projects</span>
                </li>
                <li className="nav-item">
                  <span className="nav-icon">👥</span>
                  <span>Teams</span>
                </li>
                <li className="nav-item">
                  <span className="nav-icon">📝</span>
                  <span>Tasks</span>
                </li>
                <li className="nav-item">
                  <span className="nav-icon">⚙️</span>
                  <span>Settings</span>
                </li>
              </ul>
            </nav>
            <div className="sidebar-footer">
              <div className="version">v0.1.0</div>
            </div>
          </aside>
          
          <main className="main-content">
            <Dashboard />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
