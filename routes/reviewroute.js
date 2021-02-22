const express= require('express');
const reviewController = require ('./../controllers/reviewcontroller');
const authController = require('./../controllers/authController');
const router = express.Router({mergeParams:true}) ;

router.route('/')
.get(reviewController.getReviews)
.post(authController.protect, authController.restrictTo('user','admin'),reviewController.createReviews)

router.route('/:id')
.get(authController.protect ,reviewController.getReview )
.delete(authController.protect ,reviewController.deleteReviews)
.patch(authController.protect ,reviewController.updateReview)

module.exports =router ;