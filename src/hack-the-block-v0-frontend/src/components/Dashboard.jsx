import React, { useState } from 'react';
import UserProfile from './UserProfile';
import UsernamePrompt from './UsernamePrompt';
import { updateUserProfile } from '../services/userService';
import './Dashboard.css';

/**
 * Main dashboard component that displays after user authentication
 */
const Dashboard = () => {
  const [usernameUpdated, setUsernameUpdated] = useState(false);
  
  const handleUsernameSet = async (username) => {
    try {
      await updateUserProfile({ username });
      setUsernameUpdated(true);
      setTimeout(() => setUsernameUpdated(false), 3000);
    } catch (error) {
      console.error('Error setting username:', error);
    }
  };
  
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {usernameUpdated && (
        <div className="success-message">
          Username updated successfully!
        </div>
      )}
      
      <UsernamePrompt onUsernameSet={handleUsernameSet} />
      
      <div className="dashboard-grid">
        <UserProfile />
        
        <div className="dashboard-content">
          <h2>Welcome to Decentralized Collaboration Hub</h2>
          <p>This is your dashboard where you can manage your projects and collaborations.</p>
          
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
    </div>
  );
};

export default Dashboard; 