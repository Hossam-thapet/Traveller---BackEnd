const Review = require ('./../model/reviewmodule');
const catchAsync= require('./../utility/catchError');
const factory = require('./handlerFunctions');
const AppError= require('./../utility/error');


exports.getReviews= factory.getAll(Review);
exports.createReviews= factory.addOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReviews = catchAsync(async(req,res,next)=>{
    const document = await Review.findById(req.params.id);
    if(req.user.id !== document.user.id ) return next(new AppError("you dont have the permissoin to delete it"));
    const doc = await Review.deleteOne();
    if(!doc)return next(new AppError("no document with that id"))
    res.status(204).json({
        state:"success",
        data:null
    })
});
exports.updateReview = catchAsync(async(req,res,next)=>{
    const document = await Review.findById(req.params.id);
    if(req.user.id !== document.user.id ) return next(new AppError("you dont have the permissoin to Edit it"));
    const doc = await Review.findByIdAndUpdate(req.params.id,req.body , { new:true, runValidators :true});
    res.status(200).json({
        state:"success",
        data: {doc}
    })
})