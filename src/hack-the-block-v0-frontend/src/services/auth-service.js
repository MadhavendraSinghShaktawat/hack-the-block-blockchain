import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../utils/canister-imports';
import { canisterId } from 'decalaration/hack_the_block_v0_backend';
/**
 * Service for handling authentication with Internet Identity
 */
class AuthService {
  /**
   * The authentication client instance
   * @private
   */
  #authClient = null;
  
  /**
   * Initializes and gets the authentication client
   * @returns {Promise<AuthClient>} The authentication client
   * @throws {Error} If client creation fails
   */
  async getAuthClient() {
    if (!this.#authClient) {
      this.#authClient = await AuthClient.create();
    }
    return this.#authClient;
  }
  
  /**
   * Authenticates the user with Internet Identity
   * @param {Object} options - Authentication options
   * @param {Function} options.onSuccess - Callback function on successful authentication
   * @param {Function} options.onError - Callback function on authentication error
   * @returns {Promise<void>}
   */
  async login({ onSuccess, onError }) {
    try {
      const authClient = await this.getAuthClient();
      
      await authClient.login({
        identityProvider: canisterId,
        onSuccess: async () => {
          if (onSuccess) {
            const identity = authClient.getIdentity();
            const principal = identity.getPrincipal().toString();
            
            // Create backend actor with identity
            const backendActor = this.createBackendActor(identity);
            
            onSuccess({ identity, principal, backendActor });
          }
        },
        onError: (error) => {
          console.error("Authentication error:", error);
          if (onError) {
            onError(error);
          }
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      if (onError) {
        onError(error);
      }
    }
  }
  
  /**
   * Logs the user out
   * @returns {Promise<void>}
   * @throws {Error} If logout fails
   */
  async logout() {
    const authClient = await this.getAuthClient();
    await authClient.logout();
  }
  
  /**
   * Checks if the user is authenticated
   * @returns {Promise<boolean>} True if authenticated, false otherwise
   */
  async isAuthenticated() {
    const authClient = await this.getAuthClient();
    return authClient.isAuthenticated();
  }
  
  /**
   * Gets the user's identity
   * @returns {Identity|null} The user's identity or null if not authenticated
   */
  getIdentity() {
    if (!this.#authClient) {
      return null;
    }
    return this.#authClient.getIdentity();
  }
  
  /**
   * Creates a backend actor with the given identity
   * @param {Identity} identity - The user's identity
   * @returns {Object} The backend actor
   */
  createBackendActor(identity) {
    return createActor(process.env.CANISTER_ID_HACK_THE_BLOCK_V0_BACKEND || '', {
      agentOptions: {
        identity
      }
    });
  }
}

// Export a singleton instance
export const authService = new AuthService(); 