# Deployment Guide for Hack-the-Block Frontend

This guide will help you deploy the application to production on the Internet Computer (IC) blockchain.

## Prerequisites

- DFX CLI installed (`dfx --version` should return the version)
- Node.js and npm installed
- Access to a shell/terminal

## Step 1: Update Environment Variables

1. Edit the `.env.production` file with your actual canister IDs:

```
VITE_CANISTER_ID_HACK_THE_BLOCK_V0_BACKEND=<your-backend-canister-id>
VITE_DFX_NETWORK=ic
VITE_HOST_URL=https://ic0.app
```

You can get your canister ID by running:
```bash
dfx canister --network ic id hack-the-block-v0-backend
```

## Step 2: Build the Frontend

Run the production build:

```bash
cd src/hack-the-block-v0-frontend
npm install
npm run build
```

This will create a `dist` directory with the optimized production build.

## Step 3: Deploy the Frontend Canister

1. Make sure your `dfx.json` has the frontend canister correctly configured:

```json
{
  "canisters": {
    "hack-the-block-v0-frontend": {
      "frontend": {
        "entrypoint": "src/hack-the-block-v0-frontend/dist/index.html"
      },
      "source": ["src/hack-the-block-v0-frontend/dist"],
      "type": "assets"
    },
    "hack-the-block-v0-backend": {
      "main": "src/hack-the-block-v0-backend/src/lib.rs",
      "type": "rust"
    }
  }
}
```

2. Deploy the frontend to the IC network:

```bash
dfx deploy --network ic hack-the-block-v0-frontend
```

3. Get the deployed URL:

```bash
dfx canister --network ic id hack-the-block-v0-frontend
```

Your application will be available at: `https://<frontend-canister-id>.ic0.app`

## Step 4: Verify the Deployment

1. Visit your application URL
2. Test user login functionality
3. Test project creation and listing

## Troubleshooting

### Backend Connection Issues

If the frontend has issues connecting to the backend:

1. Verify that you're using the correct canister ID in `.env.production`
2. Check browser console for errors
3. Make sure your backend canister is deployed and running

### Authentication Issues

If users cannot authenticate:

1. Ensure Internet Identity integration is properly configured
2. Check if the agent is correctly initialized with fetchRootKey for local or skipping it for production

### Performance Optimization

To improve the application's performance:

1. Enable HTTP asset caching in dfx.json:

```json
"hack-the-block-v0-frontend": {
  "frontend": {
    "entrypoint": "src/hack-the-block-v0-frontend/dist/index.html"
  },
  "source": ["src/hack-the-block-v0-frontend/dist"],
  "type": "assets",
  "build": "./build.sh",
  "dependencies": ["hack-the-block-v0-backend"],
  "declarations": {
    "output": "declarations"
  },
  "http_asset_caching": {
    "max_age_s": 86400,
    "immutable_types": [
      "application/javascript",
      "application/json",
      "application/wasm",
      "application/css",
      "image/png",
      "image/jpeg",
      "image/svg+xml",
      "text/css",
      "text/javascript"
    ]
  }
}
```

## Maintenance

### Updating the Deployment

To update your application:

1. Make your code changes
2. Build the frontend again
3. Deploy the updated canister:

```bash
dfx deploy --network ic hack-the-block-v0-frontend
```

### Monitoring

- Check canister cycles usage with:
  ```bash
  dfx canister --network ic status hack-the-block-v0-frontend
  ```

- Top up cycles if needed:
  ```bash
  dfx ledger top-up --network ic <canister-id> --amount <ICP-amount>
  ```

## Security Considerations

1. Always validate user input in the backend canister
2. Use HTTPS for all external resources
3. Implement appropriate access controls in backend canisters
4. Regularly update dependencies to address security vulnerabilities 