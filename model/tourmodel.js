const mongoose =require('mongoose');
// const User = require ('./usermodule');
const tourSchema = new mongoose.Schema({
    name:{
        type:String ,
        required: [true , 'Tour must have name'],
        unique : true ,
        trim : true
    },
    price:{
        type:Number ,
        required :[true , 'Tour must have price']
    },
    duration :{
        type :Number ,
        required :[true ,'Tour must have a duration']
    },
    maxGroupSize:{
        type : Number ,
        required:[true , 'Tour must have Max Group Size']
    },
    difficulty :{
        type :String ,
        required :[true ,'Tour must have a Difficulty' ]
    },
    rating:{
        type :Number ,
        required :[ true, 'Tour must have rate'] ,
        default : 4.5 ,
        max :[ 5 , 'The rating must be less than 5 ']

    },
    createdAt:{
        type:Date ,
        default :Date.now (),
    },
    startLocation :{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String ,
        description:String
    },
    locations:[
        {
          type:{
            type:String,
            default:"Point",
            enum :["Point"]
            },
            coordinates:[Number],
            description:String,
            address:String ,
            day:Number
        }
    ],
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User"
        }

    ] ,
    difficulty:{
            type:String,
            required:[true , 'Tour must have a Difficulty']
    },
    priceDiscount:Number ,
    summary:{
        type :String ,
        trim : true    
    },
    startDates:[Date]
   },
   {
       toJSON:{virtuals:true},
       toObject:{virtuals : true}
   }
);

tourSchema.virtual ('durationWeek').get(function(){
    return this.duration/7 ;
});
tourSchema.virtual('reviews',{
    ref: 'Review',
    foreignField:'tour',
    localField:'_id'
});
tourSchema.pre(/^find/ , function(next){
    this.populate({
        path: 'guides',
        select : '-__v -passwordChangedAt'
    });
    next();
})
// tourSchema.pre('save',async function(next){
//     const tourguides= await this.guides.map(async id=> await User.findById(id)) ;
//     this.guides=await Promise.all(tourguides);
//     next();
// })
const Tour = new mongoose.model('Tour' , tourSchema);


module.exports =Tour ;
