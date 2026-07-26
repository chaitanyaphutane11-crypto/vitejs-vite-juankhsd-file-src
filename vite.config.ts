import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allows Vite to read the generated build/ artifacts directly
      allow: ['.'],
    },
  },
});
