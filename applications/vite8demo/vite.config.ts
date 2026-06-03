import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import type {PluginOption} from "vite";
import MagicString from "magic-string";
import removeConsolePlugin from "./plugins/vite-plugin-remove-consolelog";
import vitePluginAIDoctor from './plugins/vite-plugin-ai-doctor'

//自定义vite插件
const pluginHtml=()=>{
    const options={
        name:'plugin-html',
        //tranform钩子函数
        transform(code:string){
            return code.replace(/:vite8/g,"world")
        }
    }
    return options satisfies PluginOption
}
export default defineConfig({
    plugins: [
        vue(),
        // removeConsolePlugin(),
        // 只有在非 CI 环境下（即本地开发时）才挂载这个 AI 医生插件
        // GitHub Actions 默认会注入 process.env.CI = 'true'
        !process.env.CI && vitePluginAIDoctor()
    ].filter(Boolean), // 过滤掉 false 值
    base:'/vite/vite8demo/',
    server:{
        port:8080           //端口
    },
    build:{
        rolldownOptions:{
            treeshake:true,    //treeshaking
        }
    }
})