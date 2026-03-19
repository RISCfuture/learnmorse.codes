import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', '.yarn', '.pnp.*', 'tests/e2e', 'cypress'],
  },

  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...pluginVue.configs['flat/strongly-recommended'],

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.vue'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    rules: {
      // TypeScript handles no-undef better than ESLint for TS files
      'no-undef': 'off',
      // Allow numbers in template literals
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Non-null assertions are sometimes necessary (e.g., lodash returns)
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },

  // Vue files
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-required-prop-with-default': 'off',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      // Vue script setup computed properties trigger false positives
      'no-useless-assignment': 'off',
      // Destructured i18n methods are safe in Vue components
      '@typescript-eslint/unbound-method': 'off',
      // Vue SFC component instance types (InstanceType<typeof Component>) and
      // vue-i18n tm() don't resolve well with strict type-checking
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },

  // Config files — disable type-checked rules
  {
    files: ['*.config.ts', '*.config.js'],
    ...tseslint.configs.disableTypeChecked,
  },

  // env.d.ts
  {
    files: ['env.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // Test files
  {
    files: ['src/**/__tests__/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },

  // Test setup files
  {
    files: ['tests/unit/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
)
