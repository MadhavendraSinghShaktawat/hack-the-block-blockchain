import { useState, useEffect, useCallback } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../utils/canister-imports';
import { canisterId } from '../../../declarations/hack-the-block-v0-backend';

/**
 * Custom hook for using authentication in components
 * @returns {Object} Authentication state and methods
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  
  // Initialize the auth client
  useEffect(() => {
    AuthClient.create().then(client => {
      setAuthClient(client);
      
      // Check if already authenticated
      client.isAuthenticated().then(authenticated => {
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const identity = client.getIdentity();
          setIdentity(identity);
          setPrincipal(identity.getPrincipal().toString());
          
          // Create authenticated backend actor
          const actor = createActor({
            agentOptions: { identity }
          });
          setBackendActor(actor);
        }
      });
    });
  }, []);
  
  /**
   * Initiates the login process
   * @param {Object} options - Additional options
   * @param {Function} options.onSuccess - Callback on successful login
   * @param {Function} options.onError - Callback on login error
   * @returns {Promise<void>}
   */
  const login = async ({ onSuccess, onError } = {}) => {
    if (!authClient) {
      console.error("Auth client not initialized");
      if (onError) onError(new Error("Auth client not initialized"));
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authClient.login({
        // Always use the mainnet Internet Identity
        identityProvider: process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/"
        : "http://b77ix-eeaaa-aaaaa-qaada-cai.localhost:4943",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          setIdentity(identity);
          setPrincipal(identity.getPrincipal().toString());
          setIsAuthenticated(true);
          
          // Create authenticated backend actor
          const actor = createActor({
            agentOptions: { identity }
          });
          setBackendActor(actor);
          
          setIsLoading(false);
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          console.error("Login error:", error);
          setIsLoading(false);
          if (onError) onError(error);
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      if (onError) onError(error);
    }
  };
  
  /**
   * Logs the user out
   * @param {Object} options - Additional options
   * @param {Function} options.onSuccess - Callback on successful logout
   * @param {Function} options.onError - Callback on logout error
   * @returns {Promise<void>}
   */
  const logout = async ({ onSuccess, onError } = {}) => {
    if (!authClient) {
      console.error("Auth client not initialized");
      if (onError) onError(new Error("Auth client not initialized"));
      return;
    }
    
    try {
      await authClient.logout();
      setIdentity(null);
      setPrincipal(null);
      setIsAuthenticated(false);
      setBackendActor(null);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Logout error:", error);
      if (onError) onError(error);
    }
  };
  
  return {
    isAuthenticated,
    isLoading,
    identity,
    principal,
    backendActor,
    login,
    logout
  };
} 