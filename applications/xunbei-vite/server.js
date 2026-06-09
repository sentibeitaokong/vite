const express=require('express');
const app=express()
const fs=require('fs/promises')
const esbuild=require('esbuild')
const path = require('path');
const port=3000
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/src/index.html');
})

app.get('/*.css', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'src', req.path);

        const file = await fs.readFile(filePath, 'utf-8');

        const transformResult = await esbuild.transform(file, {
            loader: 'css',
            minify: false,
        });
        console.log(`[3] esbuild 编译成功！`);

        const cssContent = JSON.stringify(transformResult.code);
        const jsInjectionCode = `
            const style = document.createElement('style');
            style.setAttribute('data-file', '${req.path}');
            style.textContent = ${cssContent};
            document.head.appendChild(style);
            export default ${cssContent}; 
        `;

        console.log(`[4] 准备返回 JS 脚本给浏览器`);
        res.type('application/javascript');
        res.end(jsInjectionCode);

    } catch (error) {
        // 这里会打印最核心的崩溃原因！
        console.error(`❌ [CSS 致命错误] 崩溃在处理 ${req.path} 时:`, error);
        res.status(500).end(`console.error("服务端编译CSS失败");`);
    }
});

app.get('/*.ts',async (req,res)=>{
    const path=req.path
    //同步方式读文件
    const file=await fs.readFile(__dirname+'/src'+path,'utf-8');
    const transformResult=await esbuild.transform(file,{
        loader:'ts',
        format:'esm',
        target:'es6'
    })
    console.log('transformResult',transformResult)
    res.type('js')
    res.end(transformResult.code)
})
app.listen(port,()=>{
    console.log(`Server started on port: ${port}`)
})