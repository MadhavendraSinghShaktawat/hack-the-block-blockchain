import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/userService';
import UserRegistration from './UserRegistration';
import './UserProfile.css';

/**
 * User profile component that shows user information and allows setting/updating username
 */
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Fetch the user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await getUserProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  // Handle username updates
  const handleUsernameUpdate = async (newUsername) => {
    try {
      const success = await updateUserProfile({ username: newUsername });
      
      if (success) {
        setProfile(prev => ({ ...prev, username: newUsername }));
        setShowRegistration(false);
      }
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };
  
  if (loading) {
    return <div className="user-profile-loading">Loading profile...</div>;
  }
  
  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>Your Profile</h2>
        {profile?.username ? (
          <button 
            className="edit-username-button" 
            onClick={() => setShowRegistration(true)}
          >
            Edit Username
          </button>
        ) : null}
      </div>
      
      <div className="profile-info">
        <div className="profile-field">
          <span className="field-label">Username</span>
          {profile?.username ? (
            <span className="field-value">{profile.username}</span>
          ) : (
            <div className="username-missing">
              <span>No username set</span>
              <button 
                className="set-username-button"
                onClick={() => setShowRegistration(true)}
              >
                Set Username
              </button>
            </div>
          )}
        </div>
        
        {/* Additional profile fields can be added here */}
        
        <div className="profile-description">
          <p>Your username is used to identify you across the platform. It helps others recognize your contributions and makes collaboration easier.</p>
        </div>
      </div>
      
      {/* Username registration modal */}
      {showRegistration && (
        <UserRegistration 
          currentUsername={profile?.username || ''}
          onComplete={handleUsernameUpdate}
          onCancel={() => setShowRegistration(false)}
        />
      )}
    </div>
  );
};

export default UserProfile; 