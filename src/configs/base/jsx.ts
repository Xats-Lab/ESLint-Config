import type { TypedFlatConfigItem } from '@/types'
import { GLOB_JSX, GLOB_TSX } from '@/constants'

export async function jsx(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      name: 'xat/jsx/setup',
    },
  ]
}
