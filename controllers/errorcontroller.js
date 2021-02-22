
        
 
const developError = (err,res) =>{
    res.status(err.statusCode).json({
        status : err.status ,
        message :err.message,
        error : err ,
        stack : err.stack

});
}

const clientError = (err,res) =>{
    if(err.isOpreational){
        console.log(err);
        res.status(err.statusCode).json({
            status: err.status,
            message :err.message 
        });
        
    }
    else {
        console.log(err);
        res.status(500).json({
            status :"error",
            message : "somrthing went wrong"
        });
        
    }
}
module.exports=(err,req,res ,next )=>{
   
    err.statusCode = err.statusCode || 500 ;
    err.status = err.status || 'error' ;

    
    if(process.env.NODE_ENV === 'development'){
        developError(err,res);
    }
    else {
        clientError(err,res);

        // console.log(err);
    }
}