import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    include: ['tests/**/*.test.mts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,mts,tsx,js,jsx}'],
      exclude: ['**/*.d.ts', 'dist/**', 'tests/**'],
    },
  },
});
