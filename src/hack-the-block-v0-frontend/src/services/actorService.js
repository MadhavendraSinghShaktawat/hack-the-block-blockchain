import { Actor, HttpAgent } from '@dfinity/agent';

// Import the generated declarations if available
let canisterId;
let idlFactory;

try {
  // First try to import from the generated declarations
  const declarations = require('../../../declarations/hack-the-block-v0-backend');
  canisterId = declarations.canisterId;
  idlFactory = declarations.idlFactory;
  console.log('Successfully imported canister declarations');
} catch (error) {
  console.warn('Failed to import canister declarations, using mock values:', error);
  // Fallback to the mock canister ID if import fails
  canisterId = process.env.CANISTER_ID_HACK_THE_BLOCK_V0_BACKEND || 'rrkah-fqaaa-aaaaa-aaaaq-cai';
  
  // Use the mock IDL factory
  idlFactory = ({ IDL }) => {
    const ProjectInput = IDL.Record({
      'title': IDL.Text,
      'description': IDL.Text,
    });
    
    const CreateProjectError = IDL.Variant({
      'UserNotRegistered': IDL.Null,
      'InvalidInput': IDL.Null,
      'InternalError': IDL.Null,
    });
    
    const CreateProjectResult = IDL.Record({
      'project_id': IDL.Opt(IDL.Nat64),
      'error': IDL.Opt(CreateProjectError),
    });
    
    const Project = IDL.Record({
      'id': IDL.Nat64,
      'title': IDL.Text,
      'description': IDL.Text,
      'creator': IDL.Principal,
      'created_at': IDL.Nat64,
      'collaborators': IDL.Vec(IDL.Principal),
    });
    
    return IDL.Service({
      'greet': IDL.Func([IDL.Text], [IDL.Text], ['query']),
      'create_project': IDL.Func([ProjectInput], [CreateProjectResult], []),
      'get_project': IDL.Func([IDL.Nat64], [IDL.Opt(Project)], ['query']),
      'get_user_projects': IDL.Func([IDL.Principal], [IDL.Vec(Project)], ['query']),
      'get_all_projects': IDL.Func([], [IDL.Vec(Project)], ['query']),
    });
  };
}

// Store the actor instance for reuse
let backendActor = null;

/**
 * Create an actor for the backend canister
 * 
 * @param {Identity} identity - The user's Internet Identity
 * @returns {Promise<Actor>} The actor instance
 */
export const createBackendActor = async (identity) => {
  const isLocalEnv = process.env.NODE_ENV !== 'production';
  const host = isLocalEnv ? 'http://localhost:8000' : 'https://ic0.app';
  
  const agent = new HttpAgent({
    host,
    identity,
  });
  
  // Only fetch the root key in a local development environment
  if (isLocalEnv) {
    await agent.fetchRootKey();
  }
  
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

/**
 * Get the backend actor, creating it if necessary
 * 
 * @returns {Promise<Actor|null>} The actor instance or null if the user is not authenticated
 */
export const getBackendActor = async () => {
  if (backendActor) {
    return backendActor;
  }
  
  try {
    // This assumes you have an authentication service that provides the identity
    // Adjust this based on your actual authentication implementation
    const authClient = window.authClient;
    
    if (!authClient || !authClient.isAuthenticated()) {
      return null;
    }
    
    const identity = await authClient.getIdentity();
    backendActor = await createBackendActor(identity);
    
    return backendActor;
  } catch (error) {
    console.error('Error creating backend actor:', error);
    return null;
  }
};

/**
 * Reset the stored actor instance
 * Useful when the user logs out
 */
export const resetBackendActor = () => {
  backendActor = null;
}; 