import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // 1. Carpetas que ESLint debe ignorar por completo
  { ignores: ['dist'] },

  // 2. Configuración estándar para tus archivos de la aplicación (.js y .jsx)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      indent: ['error', 2],
      'linebreak-style': 'off', // Desactivado para evitar errores de Windows (CRLF vs LF)
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off'
    }
  },

  // 3. 🚀 ESTA ES LA NUEVA SECCIÓN: Reglas específicas para tus archivos de prueba (.test.jsx)
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest // Esto le dice a ESLint que "test", "expect" y "describe" son válidos
      }
    }
  }
]