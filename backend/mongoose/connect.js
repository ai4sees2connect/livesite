const mongoose = require('mongoose');
// mongoose.set('debug', true);
const connection=async(url)=>{
  await mongoose.connect(url,)
  
  .catch(err=>console.error(err));
}

module.exports= connection;