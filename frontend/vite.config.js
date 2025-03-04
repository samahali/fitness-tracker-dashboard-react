import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_BASE_URL = process.env.VITE_API_BASE_URL || "https://fitness-tracker-dashboard-react.onrender.com/";

  console.log("🛠 API_BASE_URL from vite.config.js:", env.VITE_API_BASE_URL); // Debugging

  return {
    plugins: [react()],
    define: {
      "process.env.VITE_API_BASE_URL": JSON.stringify(API_BASE_URL),
    },
  };
});
