#!/bin/bash

# Deployment script for Hack-the-Block

# Stop on errors
set -e

echo "=== Hack-the-Block Deployment Script ==="
echo

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "Error: dfx is not installed. Please install the Internet Computer SDK."
    exit 1
fi

# Navigate to the project root
cd "$(dirname "$0")"

echo "Starting DFX in the background (if not already running)..."
dfx start --background || true

echo 
echo "=== Building backend canister ==="
echo

# Clean previous builds to avoid issues
echo "Cleaning previous build artifacts..."
cd src/hack-the-block-v0-backend
cargo clean
echo "Building backend with cargo..."
cargo build --target wasm32-unknown-unknown --release
cd ../..

echo
echo "=== Building frontend ==="
echo

# Build the frontend
cd src/hack-the-block-v0-frontend
echo "Installing npm dependencies..."
npm install
echo "Building frontend application..."
npm run build
cd ../..

echo
echo "=== Deploying canisters ==="
echo

# Clear any old deployments if there are issues
echo "Removing any previous deployments..."
dfx canister delete --all || true

# Deploy everything
echo "Deploying canisters..."
dfx deploy

echo
echo "=== Deployment completed successfully! ==="
echo

# Get the canister URLs
BACKEND_ID=$(dfx canister id hack-the-block-v0-backend)
FRONTEND_ID=$(dfx canister id hack-the-block-v0-frontend)

echo "Backend canister ID: $BACKEND_ID"
echo "Frontend canister ID: $FRONTEND_ID"
echo
echo "Local frontend URL: http://localhost:4943/?canisterId=$FRONTEND_ID"
echo
echo "To deploy to the IC mainnet, run: dfx deploy --network ic"
echo 