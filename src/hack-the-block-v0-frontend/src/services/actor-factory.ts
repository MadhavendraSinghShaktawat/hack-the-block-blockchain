// This file is deprecated and replaced by actor-service.js
// Keeping it here for backward compatibility
import { createActor, getActor } from './actor-service';

// Re-export the functions from actor-service.js
export { createActor, getActor };

// Backward compatibility for any code using BackendService
export interface BackendService {
  create_project: (input: any) => Promise<any>;
  get_projects: () => Promise<any[]>;
  get_all_projects: () => Promise<any[]>;
  get_user_projects: (principal: any) => Promise<any[]>;
  get_project: (id: bigint) => Promise<any | undefined>;
}

// Backward compatibility for createBackendActor
export const createBackendActor = getActor; 