import { ChatOllama } from "@langchain/ollama";
import { HumanMessage } from "@langchain/core/messages";

// 1. 初始化本地模型实例 (请确保终端里的 Ollama 守护进程没有退出)
const llm = new ChatOllama({
    model: "qwen2.5:3b", // 替换成您刚才 pull 下来的任何本地模型
    temperature: 0.1,       // 偏向严谨输出
});

// 2. 测试调用链路
export const handleResolver=async (error:Error)=>{
    const {name,message,stack}=error;
    const prompt=`
    出错了,
    ${name}
    ${message}
    ${stack}
    请根据给出的信息，帮我梳理问题，并且给出解决方案
    `
    // 2. 调用 stream 方法，获取异步可迭代对象
    const stream = await llm.stream([new HumanMessage({ content: prompt })]);

    // 3. 使用 for await...of 消费流数据 (这就是天然的打字机过程)
    for await (const chunk of stream) {
        // chunk.content 包含了本次生成的字符片段
        // 使用 process.stdout.write 在同一行连续输出
        // 添加 typeof 检查，收窄类型为 string
        if (chunk.content && typeof chunk.content === "string") {
            process.stdout.write(chunk.content);
        }
        // 如果是复杂的数组形式（在纯文本对话中极其罕见，通常可忽略或转 JSON）
        else if (Array.isArray(chunk.content)) {
            process.stdout.write(JSON.stringify(chunk.content));
        }
    }
    // 4. 整个流接收完毕后，打一个换行符收尾，保持终端整洁
    console.log("\n\n✅ 回答完毕！");
}