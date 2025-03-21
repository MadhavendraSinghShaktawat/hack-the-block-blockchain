import { getBackendActor } from './actorService';
import { getMockBackendActor } from './mockActorService';

// Determine if we should use the mock service
// This happens when:
// 1. We're in development mode
// 2. The backend canister is not accessible
// 3. Authentication fails
let useMockService = process.env.REACT_APP_USE_MOCK === 'true';

/**
 * Get the appropriate actor for backend communication
 * Will use mock actor if real actor is unavailable
 */
const getActor = async () => {
  try {
    // Try to get the real backend actor first
    const actor = await getBackendActor();
    if (actor) {
      return actor;
    }
    
    // If no real actor available, use mock
    console.log('Using mock backend actor for development');
    useMockService = true;
    return getMockBackendActor();
  } catch (error) {
    console.warn('Error getting backend actor, falling back to mock:', error);
    useMockService = true;
    return getMockBackendActor();
  }
};

/**
 * Creates a new project in the backend canister
 * 
 * @param {Object} projectData - The project data
 * @param {string} projectData.title - The title of the project
 * @param {string} projectData.description - The description of the project
 * @returns {Promise<Object>} The result of the creation operation
 */
export const createProject = async (projectData) => {
  try {
    const { title, description } = projectData;
    
    if (!title || !description) {
      throw new Error('Title and description are required');
    }
    
    const backendActor = await getActor();
    
    if (!backendActor) {
      throw new Error('Backend actor not available. Please make sure you are logged in.');
    }
    
    const result = await backendActor.create_project({
      title,
      description
    });
    
    if (result.error && result.error.length > 0) {
      // Handle specific error cases
      const error = result.error[0];
      if ('UserNotRegistered' in error) {
        throw new Error('You need to register before creating projects');
      } else if ('InvalidInput' in error) {
        throw new Error('Invalid project data. Title and description cannot be empty.');
      } else {
        throw new Error('Failed to create project. Please try again later.');
      }
    }
    
    return {
      success: true,
      projectId: Number(result.project_id[0]),
      isMock: useMockService,
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      isMock: useMockService,
    };
  }
};

/**
 * Gets a project by ID from the backend canister
 * 
 * @param {number} projectId - The ID of the project to get
 * @returns {Promise<Object>} The project data
 */
export const getProject = async (projectId) => {
  try {
    const backendActor = await getActor();
    
    if (!backendActor) {
      throw new Error('Backend actor not available. Please make sure you are logged in.');
    }
    
    const project = await backendActor.get_project(BigInt(projectId));
    
    if (!project || project.length === 0) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    return {
      success: true,
      project: project[0], // Unwrap the option
      isMock: useMockService,
    };
  } catch (error) {
    console.error('Error getting project:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      isMock: useMockService,
    };
  }
};

/**
 * Gets all projects for the current user from the backend canister
 * 
 * @param {string} principal - The principal ID of the user
 * @returns {Promise<Object>} The user's projects
 */
export const getUserProjects = async (principal) => {
  try {
    const backendActor = await getActor();
    
    if (!backendActor) {
      throw new Error('Backend actor not available. Please make sure you are logged in.');
    }
    
    const projects = await backendActor.get_user_projects(principal);
    
    return {
      success: true,
      projects,
      isMock: useMockService,
    };
  } catch (error) {
    console.error('Error getting user projects:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      isMock: useMockService,
    };
  }
};

/**
 * Gets all projects from the backend canister
 * 
 * @returns {Promise<Object>} All projects
 */
export const getAllProjects = async () => {
  try {
    const backendActor = await getActor();
    
    if (!backendActor) {
      throw new Error('Backend actor not available. Please make sure you are logged in.');
    }
    
    const projects = await backendActor.get_all_projects();
    
    return {
      success: true,
      projects,
      isMock: useMockService,
    };
  } catch (error) {
    console.error('Error getting all projects:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      isMock: useMockService,
    };
  }
}; 