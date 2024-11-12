// import cron from 'cron';
const cron =require('cron');
const https=require('https');
// import https from 'https';

const backendURL="https://livesite-vvgu.onrender.com";
const job=new cron.CronJob('*/14 * * * *',function(){
  console.log('Restarting server');

  https.get(backendURL,(res)=>{
    if(res.statusCode==200){
      console.log('server restarted');
    }else{
      console.log(`Failed to restart server with status code: ${res.statusCode}`);
    }
  })
  .on('error',(err)=>{
    console.log("Error during restart",err.message);
  });
});

module.exports= job;