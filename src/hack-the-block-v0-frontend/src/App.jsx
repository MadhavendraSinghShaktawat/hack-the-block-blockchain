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
      ) : (
        <div className="authenticated-container">
          <header className="header">
            <div className="logo-container">
              <ICPLogo />
              <h1>CollabChain</h1>
            </div>
            <div className="user-info">
              <div className="user-badge">
                <div className="user-avatar">{principal?.charAt(0) || 'U'}</div>
                <p>Connected as: <span className="principal">{principal}</span></p>
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
          
          <div className="dashboard">
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
              <div className="page-header">
                <h1>Dashboard</h1>
                <div className="page-actions">
                  <button className="action-btn">
                    <span>New Project</span>
                  </button>
                </div>
              </div>
              <div className="content">
                <BackendInteraction actor={backendActor} />
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
