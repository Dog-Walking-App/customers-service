import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import imprt from 'eslint-plugin-import';

export default [
  {
    files: ['index.ts', 'src/**/*.ts'],
    ignores: ['**/*.d.*', '**/*.map.*', '**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
    plugins: {
      import: imprt,
      '@typescript-eslint': ts,
      ts,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,

      'no-multiple-empty-lines': ['error', { max: 2 }],
      semi: 'off',
      '@typescript-eslint/semi': ['error', 'always'],
      '@typescript-eslint/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      }],
      'comma-dangle': 'off',
      'max-len': ['error', { code: 100, ignoreStrings: true, ignorePattern: '^\\s*// eslint-disable' }],
      '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
      'multiline-ternary': 'off',
      'no-unused-vars': 'off',
      indent: ['error', 2],
      'no-trailing-spaces': 'error',
    },
  },
];
