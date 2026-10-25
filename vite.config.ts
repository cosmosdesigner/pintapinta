import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  test: { include: ['src/**/*.test.ts'] },
  build: { target: ['es2022', 'safari16'] },
});
