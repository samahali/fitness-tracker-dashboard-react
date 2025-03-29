import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_BASE_URL = env.VITE_API_BASE_URL || "https://fitness-tracker-dashboard-react.onrender.com";

  return {
    plugins: [react()],
    define: {
      "process.env.VITE_API_BASE_URL": JSON.stringify(API_BASE_URL),
    },
    server: {
      watch: {
        usePolling: true, // Enable polling for file changes
      },
    },
    // test: {
    //   globals: true,
    //   environment: 'jsdom', // Simulates a browser-like environment
    //   setupFiles: './src/setupTests.js', // Global setup file
    // },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      coverage: {
        reporter: ["text", "json", "html"],
        exclude: ["node_modules/", "src/setupTests.js"],
      },
      include: ["__tests__/**/*.{test,spec}.{js,jsx}"],
    },
  };
});