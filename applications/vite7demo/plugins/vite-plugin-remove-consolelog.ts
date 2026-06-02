import type { Plugin } from 'vite';
import { parse } from '@babel/parser';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
//自定义删除console.log语句
export default function removeConsolePlugin(): Plugin {
    return {
        name: 'vite-plugin-remove-console-estree',

        // enforce: 'pre' 确保我们的插件在 Vite 核心插件处理代码前执行
        enforce: 'pre',

        // 仅在生产环境构建时生效，开发阶段保留 console
        apply: 'build',

        transform(code, id) {
            // 1. 过滤：排除 node_modules 和不需要处理的非脚本文件
            if (id.includes('node_modules') || !/\.(js|ts|vue|jsx|tsx)$/.test(id)) {
                return null;
            }

            // 2. 初始化 MagicString 实例
            const ms = new MagicString(code);
            console.log('ms',ms)
            let hasConsoleLog = false;

            try {
                // 3. 将源码解析为 AST
                // 注意：这里我们借助 Babel 来支持 ts 和 jsx，但强制让它输出符合 ESTree 规范的 AST
                const ast = parse(code, {
                    sourceType: 'module',
                    plugins: ['typescript', 'jsx', 'estree']
                });
                console.log('ast',ast)
                // 4. 使用 estree-walker 遍历 AST
                // @ts-ignore (跳过由于 Babel 的 AnyNode 类型与 estree-walker 的 Node 类型声明不完全匹配导致的 ts 警告)
                walk(ast, {
                    enter(node: any) {
                        // 核心逻辑：寻找目标 AST 节点
                        // 我们要找的是一个调用表达式 (CallExpression)，其调用者是 console.log
                        if (
                            node.type === 'CallExpression' &&
                            node.callee.type === 'MemberExpression' &&
                            node.callee.object.type === 'Identifier' &&
                            node.callee.object.name === 'console' &&
                            node.callee.property.type === 'Identifier' &&
                            node.callee.property.name === 'log'
                        ) {
                            hasConsoleLog = true;

                            // 5. 使用 magic-string 删除代码
                            // ESTree 规范的节点自带 start 和 end 属性，完美契合 magic-string 的 API
                            ms.remove(node.start, node.end);

                            // 性能优化：既然已经删除了这个 console.log 节点，就没必要再遍历它的参数子节点了
                            this.skip();
                        }
                    }
                });
            } catch (e) {
                // 解析如果遇到严重语法错误（比如某些极端的 SFC 模板），静默跳过或可加一行 warning
                return null;
            }

            // 6. 如果文件里根本没有 console.log，直接返回 null 告诉 Vite 无需转换，节省构建开销
            if (!hasConsoleLog) {
                return null;
            }

            // 7. 返回处理后的代码以及高精度的 SourceMap
            return {
                code: ms.toString(),
                map: ms.generateMap({ hires: true })
            };
        }
    };
}