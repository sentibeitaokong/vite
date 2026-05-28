import { globalIgnores } from 'eslint/config'
import {
    defineConfigWithVueTs,
    vueTsConfigs,
} from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'

export default defineConfigWithVueTs(
    {
        name: 'app/files-to-lint',
        files: ['**/*.{js,cjs,mjs,ts,mts,tsx,vue}'],
    },
    globalIgnores([
        '**/dist/**',
        '**/dist-ssr/**',
        '**/coverage/**',
        '**/docs/.vitepress/**',
        '**/*.snap',
    ]),
    // Vue 核心规则（轻量）
    pluginVue.configs['flat/essential'],

    // Vue + TypeScript 推荐规则（包含 Vue 推荐规则，所以上面的 essential 可选）
    vueTsConfigs.recommended,
    // Vitest 测试文件配置
    {
        ...pluginVitest.configs.recommended,
        files: ['src/**/__tests__/**/*.{test,spec}.{js,ts,tsx}'],
    },
    // 配置文件专用全局变量
    {
        files: ['vite.config.ts', 'vitest.config.ts', 'eslint.config.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    skipFormatting,

    // 添加规则配置，关闭组件双单词命名检查
    {
        rules: {
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    // 👇 新增：忽略 vite-env.d.ts 的未使用变量检查
    {
        files: ['**/vite-env.d.ts'],
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            'no-unused-vars': 'off',
            // 禁用空对象类型检查
            '@typescript-eslint/no-empty-object-type': 'off',
        },
    },
)
