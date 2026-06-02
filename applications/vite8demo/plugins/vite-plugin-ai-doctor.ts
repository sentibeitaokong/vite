import type { Plugin } from 'vite';
import pc from 'picocolors'
import {handleResolver} from "../ai-engine/error-resolver";

export default function vitePluginAIDoctor(): Plugin {
    return {
        name: 'vite-plugin-ai-doctor',

        // enforce: 'pre' 确保我们的插件在 Vite 核心插件处理代码前执行
        enforce: 'pre',

        // 仅在生产环境构建时生效，开发阶段保留 console
        apply: 'build',

        async buildEnd(error){
            if(error){
                // console.log(error)
                process.stdout.write(pc.bgRed(pc.white('\n'+'构建报错检测到')) + '\n');
                process.stdout.write(pc.bgRed(error.name) + '\n');
                process.stdout.write(pc.bgRed(error.message) + '\n');
                process.stdout.write(pc.yellow('vite-ai-doctor正在紧急诊断中，请不要关闭终端')+'\n')
                //ai智能体监控
                await handleResolver(error!)
                process.exit(1)
            }
        }
    };
}