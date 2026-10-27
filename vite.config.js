import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ostrovok-ai/', // Название твоего репозитория на GitHub со слэшами!
});
