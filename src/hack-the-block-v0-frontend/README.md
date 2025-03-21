# Hack The Block v0 Frontend

This is a frontend for the Hack The Block v0 project, built using React and the Internet Computer's authentication system.

## Authentication Features

- **Internet Identity Integration**: Users can authenticate using Internet Identity
- **Principal Display**: Shows the authenticated user's principal ID
- **Authenticated Canister Calls**: Makes calls to the backend canister using the authenticated identity

## Development Setup

### Prerequisites

- Node.js and npm
- DFX CLI for Internet Computer development
- Running a local Internet Computer replica (or connecting to the IC mainnet)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local replica (if not already running):
   ```bash
   dfx start --background
   ```

3. Deploy the canisters:
   ```bash
   dfx deploy
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Authentication Configuration

The application supports both local and production authentication:

- **Local Development**: Connects to a local Internet Identity canister
- **Production**: Connects to the official Internet Identity service at `identity.ic0.app`

The environment (`DFX_NETWORK`) determines which identity provider to use.

## Testing Authentication

1. Start the application in development mode:
   ```bash
   npm run dev
   ```

2. Click the "Login with Internet Identity" button
3. Complete the authentication flow in the popup window
4. Once authenticated, your principal ID will be displayed and you can interact with the backend

## Troubleshooting

- If you're having trouble with local authentication, make sure the Internet Identity canister is deployed locally:
  ```bash
  dfx deploy internet_identity
  ```

- For local development, the Internet Identity canister should be available at `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`

- If you're getting "Agent creation failed" errors, make sure your canister IDs are correctly set in the environment 