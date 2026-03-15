import tsparser from '@typescript-eslint/parser';
import obsidianmd from 'eslint-plugin-obsidianmd';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  { ignores: ['main.js', 'node_modules', 'assets', 'eslint.config.js', 'prettier.config.js', 'esbuild.config.mjs'] },
  ...obsidianmd.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { project: './tsconfig.json' },
      globals: { ...globals.browser },
    },

    rules: {
      'obsidianmd/sample-names': 'off',
      'obsidianmd/prefer-file-manager-trash-file': 'error',
      'obsidianmd/ui/sentence-case': ['warn', { brands: ['XMind'] }],
    },
  },
]);
