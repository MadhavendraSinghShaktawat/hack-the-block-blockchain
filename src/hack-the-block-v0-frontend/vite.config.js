import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import environment from 'vite-plugin-environment';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [
      react(),
      environment("all", { prefix: "VITE_" }),
      environment("all", { prefix: "CANISTER_" }),
      environment("all", { prefix: "DFX_" }),
    ],
    define: {
      // This makes @dfinity/agent work
      global: 'globalThis',
      'process.env': {}
    },
    resolve: {
      alias: {
        // Add an alias for the declarations directory
        '@declarations': path.resolve(__dirname, '../../declarations'),
        '@src': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@services': path.resolve(__dirname, 'src/services'),
      },
    },
    build: {
      sourcemap: mode !== 'production',
      minify: mode === 'production',
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
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
          manualChunks: (id) => {
            // Split vendor chunks to optimize caching
            if (id.includes('node_modules')) {
              if (id.includes('@dfinity')) {
                return 'vendor-dfinity';
              }
              return 'vendor';
            }
          }
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
          target: env.VITE_HOST_URL || 'http://localhost:4943',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
      // Add headers for CORS and security in development
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'same-origin',
      }
    },
  };
});
