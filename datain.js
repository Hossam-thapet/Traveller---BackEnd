const fs = require ('fs');
const dotenv =require('dotenv');
const mongoose =require('mongoose');
const Tour =require ('./model/tourmodel');
 dotenv.config({path:'./config.env'});
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
 
 mongoose.connect(DB,{
     useNewUrlParser:true ,
     useCreateIndex :true ,
     useFindAndModify :false ,
     useUnifiedTopology: true 
 }).then (()=>{
     console.log("DB connected");
 });
  const tour = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));

  const importData = async()=>{
     try
     { await Tour.create(tour);
        console.log("Created");
    }catch (err){
        console.log(err);
    }
  };
  
importData();
// const deleteData = async()=>{
//     try
//     { 
//         await Tour.deleteMany();
//         console.log("deleted");
//    }catch (err){
//        console.log(err);
//    }
//  };
//  deleteData();