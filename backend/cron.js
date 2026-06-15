// import cron from 'cron';
const cron =require('cron');
const https=require('https');
// import https from 'https';

const backendURL="https://livesite-backend-74ut.onrender.com";
const job=new cron.CronJob('*/29 * * * *',function(){

  https.get(backendURL,(res)=>{
    if(res.statusCode==200){
      
    }else{
      console.error(`Failed to restart server with status code: ${res.statusCode}`);
    }
  })
  .on('error',(err)=>{
    console.error("Error during restart",err.message);
  });
});

module.exports= job;