/**
 * Service for handling user profile and username operations
 */

// Temporary local storage key for development
const USERNAME_STORAGE_KEY = 'hack_the_block_username';

/**
 * Save username to local storage (temporary implementation)
 * In a real application, this would make a call to your backend
 * 
 * @param {string} username - The username to save
 * @returns {Promise<boolean>} - Success status
 */
export const saveUsername = async (username) => {
  try {
    // For now, we'll just store in localStorage as a placeholder
    // In a real implementation, this would call your backend API
    localStorage.setItem(USERNAME_STORAGE_KEY, username);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return true;
  } catch (error) {
    console.error('Error saving username:', error);
    return false;
  }
};

/**
 * Get the current user's username
 * 
 * @returns {Promise<string|null>} - The username or null if not set
 */
export const getUsername = async () => {
  try {
    // For now, just retrieve from localStorage
    // In a real implementation, this would fetch from your backend
    const username = localStorage.getItem(USERNAME_STORAGE_KEY);
    
    return username;
  } catch (error) {
    console.error('Error getting username:', error);
    return null;
  }
};

/**
 * Check if the current user has set a username
 * 
 * @returns {Promise<boolean>} - True if username is set
 */
export const hasUsername = async () => {
  const username = await getUsername();
  return !!username;
};

/**
 * Update the user's profile information
 * 
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.username - User's username
 * @returns {Promise<boolean>} - Success status
 */
export const updateUserProfile = async (profileData) => {
  try {
    // In a real implementation, this would update all profile fields
    // For now, we'll just handle username
    if (profileData.username) {
      await saveUsername(profileData.username);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

/**
 * Get the user's profile data
 * 
 * @returns {Promise<Object|null>} - User profile or null if not available
 */
export const getUserProfile = async () => {
  try {
    const username = await getUsername();
    
    if (!username) {
      return null;
    }
    
    // In a real implementation, this would include more profile fields
    return {
      username,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}; 