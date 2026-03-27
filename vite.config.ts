import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Server configuration
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  
  // Plugins
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  
  // Path aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Production build optimizations
  build: {
    // Target modern browsers for better performance
    target: "es2020",
    
    // Minify with Terser for smaller bundle size
    minify: "esbuild",
   
    
    // Source maps for debugging (optional, set to false for production)
    sourcemap: mode === "development",
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Rollup options for code splitting
    rollupOptions: {
      output: {
        // Manual chunks for better caching and loading
        manualChunks: (id) => {
          // GSAP animations library
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
          
          // React ecosystem
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/@tanstack/react-query')) {
            return 'react-vendor';
          }
          
          // UI component libraries
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui';
          }
          
          // Charts and data visualization
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          
          // Utilities
          if (id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/date-fns')) {
            return 'utils';
          }
          
          // Default - node_modules vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        
        // Asset file names
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
  },
  
  // Development optimizations
  optimizeDeps: {
    // Pre-bundle these dependencies for faster dev server startup
    include: [
      "gsap",
      "lenis",
      "react-router-dom",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
    ],
    // Exclude from pre-bundling (if needed)
    exclude: [],
  },
  
  // CSS options
  css: {
    devSourcemap: mode === "development",
  },
  
  // Preview server (for testing production build locally)
  preview: {
    host: "::",
    port: 8080,
  },
}));