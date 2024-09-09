const mongoose = require('mongoose');
const connection=async(url)=>{
  await mongoose.connect(url,)
  .then(()=>console.log("MongoDB connected"))
  .catch(err=>console.log(err));
}

module.exports= connection;