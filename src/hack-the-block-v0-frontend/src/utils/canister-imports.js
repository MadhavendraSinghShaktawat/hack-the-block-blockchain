/**
 * This utility file provides safe imports for canister declarations
 * by directly interacting with the actor without using import statements
 */

import { Actor, HttpAgent } from '@dfinity/agent';

// Get the canister IDs from environment variables
const backendCanisterId = process.env.CANISTER_ID_HACK_THE_BLOCK_V0_BACKEND || 
                         (process.env.CANISTER_ID ? process.env.CANISTER_ID : 'br5f7-7uaaa-aaaaa-qaaca-cai');

// Default mock implementations
const mockBackend = {
  greet: async (name) => `Hello, ${name}! (MOCK - Using mock implementation)`
};

// Create an actor using the candid interface directly
const createBackendActor = (options = {}) => {
  try {
    const agent = options.agentOptions?.identity 
      ? new HttpAgent({ 
          ...options.agentOptions,
          host: process.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://localhost:4943' 
        })
      : new HttpAgent({
          host: process.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://localhost:4943'
        });

    // In a local development environment, need to fetch the root key
    if (process.env.DFX_NETWORK !== 'ic') {
      agent.fetchRootKey().catch(err => {
        console.warn('Unable to fetch root key. Check if your local replica is running');
        console.error(err);
      });
    }

    // The interface of the hack-the-block-v0-backend canister
    // This would normally be imported from the declarations
    const interfaceFactory = ({ IDL }) => {
      return IDL.Service({
        'greet': IDL.Func([IDL.Text], [IDL.Text], []),
        // Add other methods from your backend canister here
      });
    };

    return Actor.createActor(interfaceFactory, {
      agent,
      canisterId: backendCanisterId,
      ...options
    });
  } catch (error) {
    console.error('Failed to create actor:', error);
    return mockBackend;
  }
};

// Create default actor without authentication - but in a way that doesn't
// cause errors if the canister is not available
let backend;
try {
  // Use a safer approach that doesn't immediately connect to the canister
  backend = {
    greet: async (name) => {
      try {
        const actor = createBackendActor();
        return await actor.greet(name);
      } catch (error) {
        console.error('Error calling greet:', error);
        return `Hello, ${name}! (Error connecting to backend)`;
      }
    }
  };
  console.log('Successfully initialized backend canister actor');
} catch (error) {
  console.error('Failed to create backend canister actor, using mock:', error);
  backend = mockBackend;
}

export const hack_the_block_v0_backend = backend;
export const createActor = createBackendActor; 