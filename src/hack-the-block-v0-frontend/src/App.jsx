import { useState } from 'react';
import { hack_the_block_v0_backend } from './utils/canister-imports';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from './hooks/useAuth';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [greeting, setGreeting] = useState('');
  const { 
    isAuthenticated, 
    isLoading, 
    principal, 
    backendActor, 
    login, 
    logout 
  } = useAuth();

  // Handle form submission for the greeting
  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    
    // Use authenticated actor if available, otherwise use the default one
    const actor = backendActor || hack_the_block_v0_backend;
    
    actor.greet(name).then((greeting) => {
      setGreeting(greeting);
      toast.success("Greeting received successfully!");
    }).catch(error => {
      console.error("Error calling greet:", error);
      toast.error("Failed to get greeting. Please try again.");
    });
    
    return false;
  }

  // Handle login with Internet Identity
  const handleLogin = async () => {
    login({
      onSuccess: () => toast.success("Successfully authenticated"),
      onError: (error) => {
        console.error("Login error:", error);
        toast.error("Authentication failed");
      }
    });
  };

  // Handle logout
  const handleLogout = async () => {
    logout({
      onSuccess: () => toast.info("Logged out successfully"),
      onError: (error) => {
        console.error("Logout error:", error);
        toast.error("Logout failed");
      }
    });
  };

  return (
    <main>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="header">
        <img src="/logo2.svg" alt="DFINITY logo" />
        <div className="auth-section">
          {isLoading ? (
            <button disabled>Authenticating...</button>
          ) : isAuthenticated ? (
            <div className="authenticated">
              <span className="principal">Principal: {principal}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button onClick={handleLogin}>Login with Internet Identity</button>
          )}
        </div>
      </div>
      
      <div className="content">
        <h1>Hack The Block v0</h1>
        
        <form action="#" onSubmit={handleSubmit} className="greeting-form">
          <label htmlFor="name">Enter your name: &nbsp;</label>
          <input id="name" alt="Name" type="text" />
          <button type="submit">Click Me!</button>
        </form>
        
        {greeting && (
          <section id="greeting" className="greeting-section">
            {greeting}
          </section>
        )}
      </div>

      {isAuthenticated && (
        <div className="authenticated-info">
          <h2>You are authenticated!</h2>
          <p>You can now interact with the backend canister using your identity.</p>
          <p>Your principal ID is: <code>{principal}</code></p>
        </div>
      )}
    </main>
  );
}

export default App;
