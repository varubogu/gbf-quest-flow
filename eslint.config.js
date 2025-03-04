import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import astroPlugin from 'eslint-plugin-astro';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  eslint.configs.recommended,
  /** @type {import('eslint').Linter.FlatConfig} */
  ...astroPlugin.configs['flat/recommended'],
  {
    ignores: [
      '**/node_modules/**',
      '**/.bun/**/*.**',
      '**/zod@*/**',
      '**/.astro/**',
      '**/.devcontainer/**',
      '**/.github/**',
      '**/.vscode/**',
      '**/coverage/**',
      '**/dist/**',
      '**/test-results/**',
      '**/playwright-report/**',
    ]
  },

  // js/ts/jsx/tsx コードファイル
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        history: 'readonly',
        structuredClone: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        React: 'readonly',
      },
    },
    plugins: {
      react: /** @type {import('eslint-plugin-react').Plugin} */ (reactPlugin),
      'react-hooks': /** @type {import('eslint').ESLint.Plugin} */ (reactHooksPlugin),
      import: /** @type {import('eslint').ESLint.Plugin} */ (importPlugin),
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-case-declarations': 'warn',
      'no-undef': 'error',
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        destructuredArrayIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        args: 'all'
      }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // js/ts/jsx/tsx テストコードファイル
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },

    },
  },
  // TypeScript
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        history: 'readonly',
        structuredClone: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': /** @type {import('@typescript-eslint/utils').TSESLint.Plugin} */ (tseslint),
      react: /** @type {import('eslint-plugin-react').Plugin} */ (reactPlugin),
      'react-hooks': /** @type {import('eslint').ESLint.Plugin} */ (reactHooksPlugin),
      import: /** @type {import('eslint').ESLint.Plugin} */ (importPlugin),
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        destructuredArrayIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        args: 'all'
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // astro コードファイル
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroPlugin.parser,
      parserOptions: {
        parser: tseslintParser,
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.astro'],
        sourceType: 'module',
      },
      globals: {
        React: 'readonly',
        Astro: 'readonly',
      },
    },
    plugins: {
      astro: /** @type {import('eslint').ESLint.Plugin} */ (astroPlugin),
    },
    rules: {
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'error',
    },
    processor: astroPlugin.processors['.astro'],
  },

  // 特定のディレクトリからのインポート制限
  {
    files: ['**/src/ZZZZ/**/*.{js,jsx,ts,tsx,astro}'],
    plugins: {
      import: /** @type {import('eslint').ESLint.Plugin} */ (importPlugin),
    },
    rules: {
      // ZZZZディレクトリからは、XXXXディレクトリのみにアクセスを許可
      'import/no-restricted-paths': ['error', {
        zones: [
          {
            target: '**/src/ZZZZ/**/*',
            from: '**/src/**/*',
            except: ['**/src/XXXX/**/*']
          }
        ]
      }]
    }
  },

  // 依存関係の制限ルール
  {
    files: ['**/src/core/services/**/*.{js,jsx,ts,tsx,astro}'],
    plugins: {
      import: /** @type {import('eslint').ESLint.Plugin} */ (importPlugin),
    },
    rules: {
      // src/core/service -> src/core/facadeを参照禁止（依存関係が逆転している）
      // src/core/servicesから/src/core/hooks, src/componentsを参照禁止（依存関係が逆転している）
      'import/no-restricted-paths': ['warn', {
        zones: [
          {
            target: '**/src/core/services/**/*',
            from: '**/src/core/facades/**/*'
          },
          {
            target: '**/src/core/services/**/*',
            from: '**/src/core/hooks/**/*'
          },
          {
            target: '**/src/core/services/**/*',
            from: '**/src/components/**/*'
          }
        ]
      }]
    }
  },
  {
    files: ['**/src/core/facades/**/*.{js,jsx,ts,tsx,astro}'],
    plugins: {
      import: /** @type {import('eslint').ESLint.Plugin} */ (importPlugin),
    },
    rules: {
      // src/core/facade -> src/core/storesを参照禁止（serviceを経由するか、コンポーネントから直接参照すべき）
      'import/no-restricted-paths': ['warn', {
        zones: [
          {
            target: '**/src/core/facades/**/*',
            from: '**/src/core/stores/**/*'
          }
        ]
      }]
    }
  },
  {
    files: ['**/src/components/**/*.{js,jsx,ts,tsx,astro}'],
    plugins: {
      import: /** @type {import('eslint').ESLint.Plugin} */ (importPlugin),
    },
    rules: {
      // src/components -> src/core/serviceを参照禁止（facade経由でアクセスするべき）
      'import/no-restricted-paths': ['warn', {
        zones: [
          {
            target: '**/src/components/**/*',
            from: '**/src/core/services/**/*'
          }
        ]
      }]
    }
  },
  {
    files: ['**/src/core/hooks/**/*.{js,jsx,ts,tsx,astro}'],
    plugins: {
      import: /** @type {import('eslint').ESLint.Plugin} */ (importPlugin),
    },
    rules: {
      // src/core/hooks -> src/core/serviceを参照禁止（facade経由でアクセスするべき）
      'import/no-restricted-paths': ['warn', {
        zones: [
          {
            target: '**/src/core/hooks/**/*',
            from: '**/src/core/services/**/*'
          }
        ]
      }]
    }
  },
  // src/core/storesからsrc/core/service, src/core/facades, src/core/hooks, src/componentsを参照禁止（依存関係が逆転している）
  {
    files: ['**/src/core/stores/**/*.{js,jsx,ts,tsx,astro}'],
    plugins: {
      import: /** @type {import('eslint').ESLint.Plugin} */ (importPlugin),
    },
    rules: {
      'import/no-restricted-paths': ['warn', {
        zones: [
          {
            target: '**/src/core/stores/**/*',
            from: '**/src/core/services/**/*'
          },
          {
            target: '**/src/core/stores/**/*',
            from: '**/src/core/facades/**/*'
          },
          {
            target: '**/src/core/stores/**/*',
            from: '**/src/core/hooks/**/*'
          },
          {
            target: '**/src/core/stores/**/*',
            from: '**/src/components/**/*'
          }
        ]
      }]
    }
  }
];

export default config;
