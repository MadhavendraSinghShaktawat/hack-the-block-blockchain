import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/idl-factory';
import { Principal } from '@dfinity/principal';

// Canister IDs from environment variables
const BACKEND_CANISTER_ID = import.meta.env.VITE_CANISTER_ID_HACK_THE_BLOCK_V0_BACKEND || 'rrkah-fqaaa-aaaaa-aaaaq-cai';

// Host URL - different for local vs. production
const HOST = import.meta.env.VITE_DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://localhost:4943';

// Create agent
const createAgent = async () => {
  const agent = new HttpAgent({ host: HOST });
  
  // Only fetch the root key when running locally
  if (import.meta.env.VITE_DFX_NETWORK !== 'ic') {
    await agent.fetchRootKey();
  }
  
  return agent;
};

// Create actor
export const createActor = async (options = {}) => {
  try {
    const agent = await createAgent();
    
    return Actor.createActor(idlFactory, {
      agent,
      canisterId: BACKEND_CANISTER_ID,
      ...options,
    });
  } catch (error) {
    console.error('Failed to create actor:', error);
    // Create a mock actor for fallback
    console.warn('Using mock actor due to creation failure');
    return createMockActor();
  }
};

// Mock actor for testing/fallback
const createMockActor = () => {
  return {
    create_project: async (input) => {
      console.log('Mock creating project:', input);
      return {
        project_id: [BigInt(123)],
        error: []
      };
    },
    get_projects: async () => {
      return [];
    },
    get_all_projects: async () => {
      return [];
    },
    get_user_projects: async () => {
      return [];
    },
    get_project: async () => {
      return undefined;
    },
    greet: async (name) => {
      return `Hello, ${name}!`;
    }
  };
};

// Singleton actor instance
let actorInstance = null;

// Get actor (creates if not exists)
export const getActor = async (forceNew = false) => {
  if (actorInstance === null || forceNew) {
    actorInstance = await createActor();
  }
  return actorInstance;
};

export default {
  createActor,
  getActor
}; 