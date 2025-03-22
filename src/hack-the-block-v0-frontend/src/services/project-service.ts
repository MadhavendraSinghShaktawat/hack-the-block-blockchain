import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { getActor } from './actor-service';

// Define project-related types to match the backend
export interface Project {
  id: bigint;
  title: string;
  description: string;
  creator: Principal;
  created_at: bigint;
  collaborators: Principal[];
}

export interface ProjectInput {
  title: string;
  description: string;
}

export type CreateProjectError = 
  | { UserNotRegistered: null }
  | { InvalidInput: null }
  | { InternalError: null };

export interface CreateProjectResult {
  project_id: [bigint] | [];
  error: [CreateProjectError] | [];
}

/**
 * Service for managing projects in the application
 */
export class ProjectService {
  private actor: any = null;
  
  /**
   * Initialize the backend actor with retry logic
   */
  private async getActor(forceNew = false): Promise<any> {
    try {
      this.actor = await getActor(forceNew);
      return this.actor;
    } catch (error) {
      console.error('Failed to create actor:', error);
      throw new Error(`Failed to initialize backend connection: ${error}`);
    }
  }

  /**
   * Execute a service method with retry logic
   * @param method The method to execute
   * @param args Arguments for the method
   * @param maxRetries Maximum number of retries
   * @returns The result of the method
   */
  private async executeWithRetry<T>(
    method: (actor: any, ...args: any[]) => Promise<T>,
    args: any[] = [],
    maxRetries = 3
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // On retries after the first attempt, force a new actor to ensure we're not using a stale one
        const actor = await this.getActor(attempt > 0);
        return await method(actor, ...args);
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);
        
        if (attempt < maxRetries) {
          // Wait with exponential backoff before retrying
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If we reach here, all retries failed
    throw lastError;
  }

  /**
   * Get all projects from the backend
   * @returns List of projects
   */
  public async getProjects(): Promise<Project[]> {
    try {
      const projects = await this.executeWithRetry(
        async (actor) => await actor.get_all_projects()
      );
      return projects as unknown as Project[];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error(`Failed to fetch projects: ${error}`);
    }
  }

  /**
   * Create a new project in the backend
   * @param projectInput Project input data
   * @returns True if project was created successfully
   */
  public async createProject(projectInput: ProjectInput): Promise<boolean> {
    try {
      const result = await this.executeWithRetry(
        async (actor) => await actor.create_project(projectInput),
        [projectInput]
      );
      
      // Cast the result to our expected type
      const typedResult = result as unknown as CreateProjectResult;
      
      // Check if there was an error
      if (typedResult.error && typedResult.error.length > 0) {
        // Fix the TypeScript error by making sure error[0] exists and is an object
        const errorObj = typedResult.error[0];
        // Get the first key of the error object which represents the error type
        const errorType = errorObj ? Object.keys(errorObj as object)[0] : 'Unknown';
        throw new Error(`Failed to create project: ${errorType}`);
      }
      
      return typedResult.project_id && typedResult.project_id.length > 0;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error(`Failed to create project: ${error}`);
    }
  }
  
  /**
   * Get a project by ID
   * @param id Project ID
   * @returns The project or undefined if not found
   */
  public async getProject(id: bigint): Promise<Project | undefined> {
    try {
      const project = await this.executeWithRetry(
        async (actor) => await actor.get_project(id),
        [id]
      );
      return project as unknown as Project | undefined;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw new Error(`Failed to fetch project: ${error}`);
    }
  }
  
  /**
   * Get projects for a specific user
   * @param principal User principal
   * @returns List of user's projects
   */
  public async getUserProjects(principal: Principal): Promise<Project[]> {
    try {
      const projects = await this.executeWithRetry(
        async (actor) => await actor.get_user_projects(principal),
        [principal]
      );
      return projects as unknown as Project[];
    } catch (error) {
      console.error('Error fetching user projects:', error);
      throw new Error(`Failed to fetch user projects: ${error}`);
    }
  }
}

export const projectService = new ProjectService(); 