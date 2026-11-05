import js from '@eslint/js'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'
import html from '@html-eslint/eslint-plugin'
import swiftwc from '@swiftwc/eslint-plugin/html/en'
import tseslint from 'typescript-eslint'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
        ],
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        files: ['**/*.html'],
        plugins: { html },
        language: 'html/html',
        extends: [swiftwc.configs.recommended],
    },
])
