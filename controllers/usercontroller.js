const User = require ('./../model/usermodule');
const catchAsync =require ('./../utility/catchError');
const AppError = require ('./../utility/error');
const factory = require('./handlerFunctions');

exports.getUsers = factory.getAll(User)

// catchAsync (async(req,res,next) =>{
    
//     const users= await User.find();
//     if(!users)
//       return  (new AppError ( "no users Found " ,404));
        
    
//     res.status(200).json({
//     state:"success",
//     result: users.length,
//     data: {users}
// });

// })
exports. getUser= factory.getOne(User);

// (req,res)=>{
//     res.status(500).json({
//         state:"error",
//         message:"Server error"
//     })
// }
exports. addUser= factory.addOne(User);
// (req,res)=>{
//     res.status(500).json({
//         state:"error",
//         message:"Server error"
//     })
// }
exports. updateUser= factory.updateOne(User);

// (req,res)=>{
//     res.status(500).json({
//         state:"error",
//         message:"Server error"
//     })
// }
exports. deleteUser= (req,res)=>{
    res.status(500).json({
        state:"error",
        message:"Server error"
    })
}