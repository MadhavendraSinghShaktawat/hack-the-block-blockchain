import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import environment from 'vite-plugin-environment';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  define: {
    // This makes @dfinity/agent work
    global: 'window',
    'process.env': process.env
  },
  resolve: {
    alias: {
      // Add an alias for the declarations directory
      '@declarations': path.resolve(__dirname, '../../declarations'),
    },
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Make sure these packages are bundled with your app
      // instead of treated as external
      external: [
        // No externals - we'll bundle everything
      ],
      output: {
        // Generate a clean build without mangling
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    // Force these packages to be pre-bundled
    include: [
      '@dfinity/agent',
      '@dfinity/auth-client',
      '@dfinity/principal',
      '@dfinity/candid'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    proxy: {
      // Handle IC management canister calls locally
      '/api': {
        target: 'http://localhost:4943',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
