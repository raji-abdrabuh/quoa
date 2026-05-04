const express=require("express");
const cors=require("cors");
const fs=require("fs");
const path=require("path");
const { stringify } = require("querystring");
const { cache } = require("react");
const app=express();
const port=3000;
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("مرحبا بك في express");
});
const filepath=path.join(__dirname,"data.json");

app.post('/api/save-data',(req,res)=>{
    const newData=req.body;
    fs.readFile(filepath,'utf8',(err,data)=>{
        let dataArray=[];
    //     if(!err&&data&&data.trim()!==''){
    //     try {
    //         dataArray=JSON.parse(data);
    //     }catch(errcatch){
    //         dataArray=[];
    //     }
    // }
    dataArray.push(newData);
    fs.writeFile(filepath,JSON.stringify(dataArray,null,2),(err)=>{
        if(err)return res.status(500).json({messag:"حدث خطاء اثناء الحفظ"});
        res.json({messag:"تم الحفظ بنجاح ",data:newData});
    })
})
})

app.listen(port,()=>{
    console.log("resever is runnnig");
})

