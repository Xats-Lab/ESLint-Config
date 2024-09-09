import { GLOB_JSX, GLOB_TSX } from '@/constants'
import { parserTs, pluginSolid } from '@/plugins'
import { toArray } from '@/utils'
import type { OptionsFiles, OptionsHasTypeScript, OptionsOverrides, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '@/types'

export async function solid(
  options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles & OptionsTypeScriptWithTypes = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_JSX, GLOB_TSX],
    overrides = {},
    typescript = true,
  } = options

  const tsconfigPath = options?.tsconfigPath
    ? toArray(options.tsconfigPath)
    : undefined
  const isTypeAware = !!tsconfigPath

  return [
    {
      name: 'xat/solid/setup',
      plugins: {
        solid: pluginSolid,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ...isTypeAware ? { project: tsconfigPath } : {},
        },
        sourceType: 'module',
      },
      name: 'xat/solid/rules',
      rules: {
        // reactivity
        'solid/components-return-once': 'warn',
        'solid/event-handlers': ['error', {
          // if true, don't warn on ambiguously named event handlers like `onclick` or `onchange`
          ignoreCase: false,
          // if true, warn when spreading event handlers onto JSX. Enable for Solid < v1.6.
          warnOnSpread: false,
        }],
        // these rules are mostly style suggestions
        'solid/imports': 'error',
        // identifier usage is important
        'solid/jsx-no-duplicate-props': 'error',
        'solid/jsx-no-script-url': 'error',
        'solid/jsx-no-undef': 'error',
        'solid/jsx-uses-vars': 'error',
        'solid/no-destructure': 'error',
        // security problems
        'solid/no-innerhtml': ['error', { allowStatic: true }],
        'solid/no-react-deps': 'error',
        'solid/no-react-specific-props': 'error',
        'solid/no-unknown-namespaces': 'error',
        'solid/prefer-for': 'error',
        'solid/reactivity': 'warn',
        'solid/self-closing-comp': 'error',
        'solid/style-prop': ['error', { styleProps: ['style', 'css'] }],
        ...typescript
          ? {
              'solid/jsx-no-undef': ['error', { typescriptEnabled: true }],
              'solid/no-unknown-namespaces': 'off',
            }
          : {},
        // overrides
        ...overrides,
      },
    },
  ]
}