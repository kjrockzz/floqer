const express=require('express');
const app=express();
const csv=require('csvtojson');
const fs = require('fs');
const cors = require('cors');

app.use(cors());

app.listen(3000,()=>{
    console.log("server is running")
})


app.get("/get",async (req,res) => {
    const salaries = await csv().fromFile("salaries.csv");
    var dic={}
    salaries.forEach(i => {
            
        if(dic[i.work_year] ){
            
            dic[i.work_year]={jobs:dic[i.work_year].jobs + 1 , sumsal : parseInt(dic[i.work_year].sumsal) +  parseInt(i.salary_in_usd) };
        }
        else{
            dic[i.work_year]={jobs:1,sumsal : parseInt(i.salary_in_usd)}
        }
        // console.log(i.salary_in_usd);
    });
    return res.json(dic)
    
});

app.get("/:year",async (req,res) => {
    const yr= req.params.year
    console.log(yr)
    const salaries = await csv().fromFile("salaries.csv");
    var dic={}
    salaries.forEach(i => {
            
       if (i.work_year === yr)
        {
            dic[i.job_title] = dic[i.job_title] ? dic[i.job_title]+1 : 1;
            
        }
        // console.log(i.salary_in_usd);
    });
    const formattedData = Object.keys(dic).map((job, index) => ({
        key: (index + 1).toString(),
        job: job,
        value: dic[job]
    }));
    return res.json(formattedData)
    
});