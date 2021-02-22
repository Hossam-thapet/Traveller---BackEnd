const mongoose = require ('mongoose');
const crypto =require ('crypto')
const bcrypt = require ('bcryptjs');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String ,
        required:[true , 'Must input a Name'],
        minlength :[ 8 , 'Name must contain 8 characters minmum'],
        trim: true 
    },
    email : {
        type:String , 
        required :[true , 'Must input a valid E-mail'],
        lowercase :true ,
        validate : [ validator.isEmail,'email is not valid']

    },
    photo:String ,
    password:{
        type:String ,
        required :[true , 'Input your password'],
        minlength :8 ,
        select : false
    },
    
    passwordConfirm:{
        type:String ,
        required:[true , 'confirm your password'],
        validate:{validator:function(el){
            return el === this.password;
        },
        message : 'passwords are not the same'
        
        }

    },
    active:{
        type:Boolean,
        default :true ,
        select:false 
    },
    passwordChangedAt:Date  ,
    role:{
        type:String ,
        enum:['user', 'guide' , 'lead-guide' , 'admin' ],
        default :'user' 
    },
    passwordResetToken:String ,
    passwordResetExpires:Date

});
userSchema.pre('save',function(next){
   if(!this.isModified || this.siNew) return next();
   this.passwordChangedAt = Date.now();
   next();
})
userSchema.pre('save' ,async function(next){
    if(!this.isModified('password')) return next();

    this.password =await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined ;
    next();
});
userSchema.methods.correctPassword= async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword , userPassword)
};
userSchema.methods.changePasswordAfter= function(JWTTIMESTAMP){
    if(this.passwordChangedAt){
        const changedtimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log( changedtimestamp ,JWTTIMESTAMP);
        return JWTTIMESTAMP < changedtimestamp 
    }
    return false ;
};
userSchema.methods.createPasswordResetToken=function(){
    const resetToken= crypto.randomBytes(32).toString('hex');
    console.log(resetToken)
    this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now()+ 10*60*1000 ;
    return resetToken ; 
}
userSchema.pre(/^find/,function(next){
this.find({active:{$ne:false}});    
next();
})
const User = mongoose.model('User',userSchema);


module.exports = User ;