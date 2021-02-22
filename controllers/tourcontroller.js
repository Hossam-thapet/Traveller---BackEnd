
const Tour = require('../model/tourmodel');
const catchAsync = require('./../utility/catchError')
const factory = require ('./handlerFunctions');
const { getDefaultDirectives } = require('helmet/dist/middlewares/content-security-policy');

exports.getToursState= catchAsync (async(req,res)=>{
  const stats=await Tour.aggregate( [
    {
            $match: {rating:{$gte:4.5}},
    },

    {
            $group:{
                _id:'$difficulty' ,
                numTours:{$sum:1},
                avgRating:{$avg:'$rating'},
                avgPrice:{$avg:'$price'},
                minPrice:{$min:'$price'},
                maxPrice:{$max:'$price'}
            }
    },    
    {
        $sort:{avgPrice:-1}
    }  
    
]);
res.status(200).json({
    state:"success",
    data: {stats}
});

})
exports.tourDates = catchAsync (async(req,res)=>{
   
     const year = req.params.year *1 ;
     const plan = await Tour.aggregate([
        {
            $unwind:'$startDates'
        },
        {
            $match : 
            {startDates: 
                { 
                $gte :new Date(`${year}-01-01`),
                $lte :new Date(`${year}-12-31`)
            }}
        },
        {
            $group:{
                _id: {$month: '$startDates'},
                theNum:{$sum :1},
                Name:{$push:'$name'}
            }
        }
    ]);
    res.status(200).json({
        state:"success",
        data: {plan}
    });
})
    exports.getTours = factory.getAll(Tour);
    exports. getTour = factory.getOne(Tour, {path:'reviews'});
    exports.addTour=factory.addOne(Tour);
    exports. updateTour = factory.updateOne(Tour)
    exports.deleteTour = factory.deleteOne(Tour);

