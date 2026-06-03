const express=require('express');
const app=express()
const fs=require('fs')
const esbuild=require('esbuild')
const port=3000
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/src/index.html');
})
app.get('/*.css',async (req,res)=>{
    const path=req.path
    //同步方式读文件
    const file=fs.readFileSync(__dirname+'/src'+path,'utf-8');
    res.type('css')
    res.end(transformResult)
})

app.get('/*.ts',async (req,res)=>{
    const path=req.path
    //同步方式读文件
    const file=fs.readFileSync(__dirname+'/src'+path,'utf-8');
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