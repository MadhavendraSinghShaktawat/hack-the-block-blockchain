import { Actor, HttpAgent } from '@dfinity/agent';

/**
 * A simplified mock service for interacting with the backend canister when declarations are not available
 * This provides a fallback implementation for testing and development
 */

// Mock response for create_project function
const mockCreateProject = async (input) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  if (!input.title || !input.description) {
    return {
      project_id: [],
      error: [{ InvalidInput: null }]
    };
  }
  
  // Generate a random project ID
  const projectId = Math.floor(Math.random() * 1000) + 1;
  
  return {
    project_id: [BigInt(projectId)],
    error: []
  };
};

// Mock response for get_project function
const mockGetProject = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  
  return [{
    id: id,
    title: `Project ${id}`,
    description: `This is a mock project with ID ${id}`,
    creator: window.principal || '2vxsx-fae',
    created_at: BigInt(Date.now() * 1000000), // Convert to nanoseconds
    collaborators: [window.principal || '2vxsx-fae']
  }];
};

// Mock response for get_user_projects function
const mockGetUserProjects = async () => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  
  return [
    {
      id: BigInt(1),
      title: 'Mock Project 1',
      description: 'This is the first mock project',
      creator: window.principal || '2vxsx-fae',
      created_at: BigInt(Date.now() * 1000000),
      collaborators: [window.principal || '2vxsx-fae']
    },
    {
      id: BigInt(2),
      title: 'Mock Project 2',
      description: 'This is the second mock project',
      creator: window.principal || '2vxsx-fae',
      created_at: BigInt(Date.now() * 1000000),
      collaborators: [window.principal || '2vxsx-fae']
    }
  ];
};

// Mock response for get_all_projects function
const mockGetAllProjects = async () => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  
  return [
    {
      id: BigInt(1),
      title: 'Mock Project 1',
      description: 'This is the first mock project',
      creator: window.principal || '2vxsx-fae',
      created_at: BigInt(Date.now() * 1000000),
      collaborators: [window.principal || '2vxsx-fae']
    },
    {
      id: BigInt(2),
      title: 'Mock Project 2',
      description: 'This is the second mock project',
      creator: window.principal || '2vxsx-fae',
      created_at: BigInt(Date.now() * 1000000),
      collaborators: [window.principal || '2vxsx-fae']
    },
    {
      id: BigInt(3),
      title: 'Another Project',
      description: 'This is a project from another user',
      creator: '3vxsx-fae', // Different creator
      created_at: BigInt(Date.now() * 1000000),
      collaborators: ['3vxsx-fae']
    }
  ];
};

/**
 * Creates a mock actor that simulates backend canister functionality
 * This is useful for local development and testing
 */
export const createMockActor = () => {
  return {
    create_project: mockCreateProject,
    get_project: mockGetProject,
    get_user_projects: mockGetUserProjects,
    get_all_projects: mockGetAllProjects,
    greet: async (name) => `Hello, ${name}!`,
  };
};

/**
 * Get a mock backend actor for development and testing
 * @returns {Object} A mock actor that simulates the backend canister
 */
export const getMockBackendActor = () => {
  return createMockActor();
}; 