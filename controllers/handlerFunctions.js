const { Model } = require('mongoose');
const catchAsync = require('./../utility/catchError');
const AppError = require('./../utility/error') 
const ApiFeatures =require('./../utility/apiFeartures');
const app = require('../try');
const Review = require('../model/reviewmodule');


exports.getOne =( Model,popOptions )=>catchAsync (async (req,res,next)=>{
        let query =Model.findById(req.params.id)
        if(popOptions) query = query.populate(popOptions);
        const doc = await query
        if(!doc){
           return next(new AppError('No document Found with that id',404 ));
        }
        res.status(200).json({
            state:"success",
            data:{doc}
        });
        
    })

exports.deleteOne = Model=> catchAsync( async(req,res,next) =>{
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc){
     return next(new AppError('No doc Found',404 ));
  }
     res.status(204).json({
     state:"success",
     data: null
 });

});
exports.addOne= Model => catchAsync (async (req,res)=>{
    if(!req.body.tour) req.body.tour =req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id ;
    const newDoc = await Model.create(req.body);
        res.status(201).json({
            state:"success",
            data: {newDoc
            }
        });
    });

exports.updateOne= Model=>catchAsync (async (req,res,next)=>{
 
    const doc = await Model.findByIdAndUpdate(req.params.id , req.body ,{
        new:true,
        runValidators :true
    });
    
    if(!doc){
        return next(new AppError('No document Found',404 ));
     }
    res.status(200).json({
        state:"success",
        data: {doc}
    });

});
    exports.getAll = Model =>catchAsync (async(req,res) =>{
        let filter ={};
    if(req.params.tourId){ filter = {tour:req.params.tourId} };
    const features= new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .paginate();
    const doc = await features.query;
    res.status(200).json({
    state:"success",
    result: doc.length,
    data: {data:doc}
});

});
    