import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        '__app_id': 'readonly' // แจ้งให้ ESLint รู้จัก __app_id
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // ปรับกฎ: เปลี่ยนจาก error เป็นแค่เตือน (warn) และอนุญาตให้มีตัวแปรที่ไม่ได้ใช้ใน argument ของฟังก์ชันได้ (เช่น catch(error))
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^[A-Z_]',
        args: 'none' 
      }],
    },
  },
])
