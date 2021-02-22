

const express = require ('express');
const morgan = require ('morgan');
const dotenv =require('dotenv');
const rateLimit = require('express-rate-limit');
const mongoose =require('mongoose');
const helmet = require('helmet');
const xss = require('xss-clean')
const dataSanatize = require('express-mongo-sanitize')
const tourRouter = require ('./routes/tourRoute');
const userRouter = require ('./routes/userRoute');
const reviewRouter = require ('./routes/reviewroute');
const globalErrorhandeler = require('./controllers/errorcontroller');
const Tour =require ('./model/tourmodel');
const AppError = require('./utility/error');
const app = express();
app.use(morgan('dev'));
app.use(helmet());
 app.use(express.json('10kb'));
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
 const port = 3000 ;
        app.listen(port , ()=>{
            console.log('connected');
        }) ;

const limiter = rateLimit({
    max:100,
    windowMs: 60*60*1000,
    message:'too many request from that id , please try again in an hour'
});
app.use( '/api',limiter);
app.use(dataSanatize());
app.use(xss());
       
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users' , userRouter);
app.use('/api/v1/reviews' , reviewRouter);

app.all('*', (req,res,next)=>{
    next (new AppError(`cant find the speciphic path ${req.originalUrl}` , 404));
});

app.use(globalErrorhandeler);

module.exports = app;