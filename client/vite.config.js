// Import the necessary function from Vite
import { defineConfig } from 'vite'
// Import the Vite React plugin
import react from '@vitejs/plugin-react'

// Define and export the Vite configuration
export default defineConfig({
  // Use the React plugin for Vite
  plugins: [react()],
  
  // Configure the development server settings
  server: {
    // Set the port for the development server
    port: 3000,
    // Open the default browser when the development server starts
    open: true,
    
    // Configure proxy settings for API requests
    proxy: {
      // Proxy requests to '/graphql' to the specified target
      '/graphql': {
        // Target URL where the API server is running
        target: 'http://localhost:3001',
        // Allow self-signed certificates (for development purposes)
        secure: false,
        // Change the origin of the request to the target URL
        changeOrigin: true
      }
    }
  }
})
