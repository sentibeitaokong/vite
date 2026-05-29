import { defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'
import { resolve } from 'path'
// 引入自动按需导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  //挂载vue插件
  plugins: [
    vuePlugin(),
    // 🌟 配置自动导入 API (如 ref, reactive, 及 ElMessage 等)
    AutoImport({
      resolvers: [ElementPlusResolver()],
      // 自动生成类型声明文件的路径，避免 TS 报错
      dts: resolve(__dirname, 'src/auto-imports.d.ts')
    }),

    // 🌟 配置自动导入组件 (如 <el-button>, <el-input> 等)
    Components({
      resolvers: [ElementPlusResolver()],
      // 自动生成类型声明文件的路径
      dts: resolve(__dirname, 'src/components.d.ts')
    })
  ],
  base: '/vite/',
  resolve: {
    alias: {
      //设置@指向‘src'目录
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8080, //端口
    open: true, //自动开启浏览器
    proxy: {
      //代理
      '/api': {
        target: 'http://localhost:3000', //代理ip
        changeOrigin: true, //跨域
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    minify: 'oxc',
    rolldownOptions: {
      //底层拆包策略
      output: {
        //压缩代码，删除console,debugger
        minify: {
          compress: {
            dropConsole: true, // Oxc Minifier 的标准写法
            dropDebugger: true
          }
        },
        codeSplitting: {
          groups: [
            {
              name: 'vue-vendor',
              test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
              entriesAware: true // 启用入口感知合并
            }
          ]
        }
      }
    }
  }
})
