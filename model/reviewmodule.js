const mongoose =require('mongoose');

const reviewSchema = new mongoose.Schema(
{
    review:
    {
        type:String ,
        required:[true , 'review can not be embty'], 
    },
    rating:
    {
        type:Number ,
        min : [1 , 'rating more than or equal to 1'],
        max: [ 5 , 'ratiing less than or equal to 5']
    },
    careatedAt:
    {
        type:Date ,
        default:Date.now
    },
    tour:
    {
        type:mongoose.Schema.ObjectId,
        ref: 'Tour',
        required:[true , 'a review must belong to any tour']
    },
    user:
    {
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required:[true , 'a review must belong to any user']
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals : true}
}
);

reviewSchema.pre(/^find/ , function(next){
    this.populate({
        path:'user',
        select:'name photo'
    });
    next();
});


const Review = mongoose.model("Review", reviewSchema);

module.exports= Review ;