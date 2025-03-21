import React, { useState } from 'react';
import UserProfile from './UserProfile';
import UsernamePrompt from './UsernamePrompt';
import ProjectModal from './ProjectModal';
import { updateUserProfile } from '../services/userService';
import './Dashboard.css';

/**
 * Main dashboard component that displays after user authentication
 */
const Dashboard = () => {
  const [usernameUpdated, setUsernameUpdated] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectCreated, setProjectCreated] = useState(false);
  const [newProjectId, setNewProjectId] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  const handleUsernameSet = async (username) => {
    try {
      await updateUserProfile({ username });
      setUsernameUpdated(true);
      setTimeout(() => setUsernameUpdated(false), 3000);
    } catch (error) {
      console.error('Error setting username:', error);
    }
  };
  
  const handleProjectCreated = (projectId, isMock = false) => {
    setNewProjectId(projectId);
    setProjectCreated(true);
    setUsingMockData(isMock);
    setTimeout(() => setProjectCreated(false), 3000);
  };
  
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {usernameUpdated && (
        <div className="success-message">
          Username updated successfully!
        </div>
      )}
      
      {projectCreated && (
        <div className="success-message">
          Project created successfully! Project ID: {newProjectId}
          {usingMockData && <span className="mock-indicator"> (Development Mode)</span>}
        </div>
      )}
      
      <UsernamePrompt onUsernameSet={handleUsernameSet} />
      
      <div className="dashboard-grid">
        <UserProfile />
        
        <div className="dashboard-content">
          <h2>Welcome to Decentralized Collaboration Hub</h2>
          <p>This is your dashboard where you can manage your projects and collaborations.</p>
          
          <div className="action-section">
            <button className="create-project-button" onClick={() => setShowProjectModal(true)}>
              Create New Project
            </button>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Getting Started</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Set your username to be recognized by other collaborators</li>
              <li style={{ marginBottom: '10px' }}>Browse existing projects or create your own</li>
              <li style={{ marginBottom: '10px' }}>Join teams to collaborate with other developers</li>
              <li style={{ marginBottom: '10px' }}>Track your progress with the task management system</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f4ff', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '10px' }}>Latest Updates</h3>
            <p>The platform is currently in beta. We appreciate your feedback as we continue to improve the experience.</p>
          </div>
        </div>
      </div>
      
      {/* Project Creation Modal */}
      <ProjectModal 
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Dashboard; 