import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import type {PluginOption} from "vite";

//自定义vite插件
const pluginHtml=()=>{
    const options={
        name:'plugin-html',
        //tranform钩子函数
        transform(code){
            return code.replace(/:vite8/g,"world")
        }
    }
    return options satisfies PluginOption
}
export default defineConfig({
    plugins: [
        vue(),
        pluginHtml()
    ],
    server:{
        port:8080           //端口
    },
    build:{
        rolldownOptions:{
            treeshake:true,    //treeshaking
        }
    }
})