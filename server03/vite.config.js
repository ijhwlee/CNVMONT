import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4000,
    proxy: {
      '/api': 'http://localhost:3000' // Your Node server
    }
  }
});