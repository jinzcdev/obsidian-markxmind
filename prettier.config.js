export default {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  overrides: [
    {
      files: ['**/*.yml', '**/*.yaml', '**/*.json'],
      options: {
        tabWidth: 2,
      },
    },
    {
      files: ['**/*.html', '**/*.htm'],
      options: {
        printWidth: 120,
        tabWidth: 2,
        bracketSameLine: false,
      },
    },
  ],
  plugins: ['prettier-plugin-organize-imports'],
};
