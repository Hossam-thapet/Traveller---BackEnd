
const {crypto} = require ('crypto');
const {promisify} = require ('util');
const User = require ('./../model/usermodule');
const catchAsync =require('./../utility/catchError');
const jwt = require ( 'jsonwebtoken')
const AppError = require ('./../utility/error');
const sendEmail = require ('./../utility/email');
const { findOne, findById } = require('./../model/usermodule');
const signToken = id =>{
  return  jwt.sign({id}, process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRE});
} 
const createSendToken = (user,statusCode,res)=>{
    const token = signToken(user._id);
    res.cookie('jwt' ,token ,{
        expiers:new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
       secure:true ,
        httpOnly:true
    })
    user.password= undefined ;
    user.active = undefined;
    res.status(statusCode).json({
        state:'success',
        token,
        data : {user}
    })
}
const filtterObj = (obj, ...allowedFields)=>{
    const newObj ={};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el]= obj[el];
    });
    
    return newObj;
}
exports.signup = catchAsync( async(req,res,next)=>{
    const newUser= await User.create({
        name : req.body.name ,
        email : req.body.email ,
        password :req.body.password ,
        passwordConfirm : req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role : req.body.role,
        active: req.body.active
    });
    createSendToken (newUser , 201 , res);
    

});
exports.login = catchAsync (async(req,res,next) =>{
    const {email , password} = req.body ; 
    if(!email || !password){
    return next(new AppError('please provid email and password', 400));
    }

    const user = await User.findOne({email}).select('+password');
    
    
    if(!user || !(await user.correctPassword(password , user.password))){
        return next (new AppError("incorrect password or email"));
    }
   
    createSendToken (user , 200 , res);
    
});

exports. protect = catchAsync(async(req,res,next)=>{
    let token ;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
         token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
       return next( new AppError ('you are not loggedin : please login to get access  ' , 401 ));
    }
    const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        next(new AppError("this user in not exist anymore !" ,401))
    }
    if(currentUser.changePasswordAfter(decoded.iat)){
        return next(new AppError("user recently changed his passwod" ,  401));
    }
    req.user = currentUser;
    next();
});
exports.restrictTo = (...roles)=>{
return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new AppError('you do not have prmission to do this process ', 403));
    }
    
next();
};
};
 
exports.forgotpassword = catchAsync(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new AppError('no user for that email ', 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});
    const resetUrl=`${req.portocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
    const message = `forgrot a password ? submit a PATCH request with new password 
    and password confirm to :${resetUrl}.\n`
   try{ await sendEmail({
        email:user.email,
        subject: "your password reset token valid for 10 minutes",
        message
    })
    res.status(200).json({
        state:"success",
        message :'token sent to email',

    });
}catch(err){
    user.createPasswordResetToken=undefined ,
    user.passwordResetExpires = undefined ,
    await user.save({validateBeforeSave:false});
    return next (new AppError('there was an error sending an email , try later'),500);
}
});
 
exports.resetPassword =catchAsync(async (req,res,next)=>{
    const hashedToken=crypto
    .createHash('sha256')
    .update('req.params.token')
    .digest('hex')

    const user = await User.findOne ({passwordResetToken:hashedToken ,
    passwordResetExpires : {gt: Date.now()}});
    if(!user){
        return next (new AppError('token are expried by now. pleace try again'),400);
    }
    user.password = user.body.password;
    user.passwordConfirm = user.body.passwordConfirm;
    passwordResetToken = undefined ;
    passwordResetExpires =  undefined ;
    await User.save();



    createSendToken (user , 200 , res);
});

exports.updatePassword =catchAsync(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.correctPassword(req.body.currentPassword , user.password)))
    return next(new AppError("wrong passwor"), 404);

    user.password = req.body.password ;
    user.passwordConfirm = req.body.passwordConfirm ;
    await user.save();
    createSendToken (user , 200 , res);
});
exports.updateMe = catchAsync(async(req,res,next)=>{
    if(req.body.password || req.body.passwordConfirm)
    return next(new AppError("changing password have a specific path . "));
    thefilter = filtterObj(req.body, 'name', 'email')
    const updateUser = await User.findByIdAndUpdate(req.user.id,thefilter,{new:true , runValidators:true});
    res.status(200).json({
        state:"success",
        user:{updateUser}
    })
})
exports.deleteMe= catchAsync(async(req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.user.id, {active:false});
    res.status(204).json({
        state:'success',
        data:null
    });
});